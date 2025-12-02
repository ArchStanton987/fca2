import { useCallback } from "react"

import {
  QueryClient,
  queryOptions,
  useSuspenseQueries,
  useSuspenseQuery
} from "@tanstack/react-query"
import { useCharInfo } from "lib/character/info/info-provider"
import { round } from "lib/common/utils/number-utils"
import { critters } from "lib/npc/const/npc-templates"
import ammoMap, { defaultAmmoSet } from "lib/objects/data/ammo/ammo"
import { AmmoSet, AmmoType } from "lib/objects/data/ammo/ammo.types"
import { DbInventory } from "lib/objects/data/objects.types"
import Weapon from "lib/objects/data/weapons/Weapon"
import { attackToWeapon } from "lib/objects/data/weapons/weapons.mappers"

import { filterUnique } from "utils/array-utils"

import { Item } from "./item.mappers"

const getInvOptions = <K extends keyof DbInventory, T>(charId: string, invElement: K) =>
  queryOptions({
    queryKey: ["v3", "playables", charId, "inventory", invElement],
    enabled: charId !== "",
    queryFn: () => new Promise<T>(() => {})
  })

export const getItemsOptions = (charId: string) =>
  getInvOptions<"items", Record<string, Item>>(charId, "items")
export const getAmmoOptions = (charId: string) => getInvOptions<"ammo", AmmoSet>(charId, "ammo")
export const getCapsOptions = (charId: string) => getInvOptions<"caps", number>(charId, "caps")

type ItemRecord = Record<string, Item>
type Options = { isEquipped?: boolean; isGrouped?: boolean }

export const itemSelector = (
  items: ItemRecord,
  cat: Item["category"],
  { isEquipped, isGrouped }: Options
) => {
  if (isGrouped) {
    return Object.fromEntries(
      filterUnique("id", Object.values(items))
        .filter(e => e.category === cat)
        .map(e => [e.id, e])
    )
  }
  return Object.fromEntries(
    Object.entries(items).filter(([, item]) => {
      if (isEquipped === undefined) return item.category === cat
      return item.category === cat && item.isEquipped === isEquipped
    })
  )
}

export function useItems<TData = Record<string, Item>>(
  charId: string,
  select?: (data: Record<string, Item>) => TData
) {
  return useSuspenseQuery({ ...getItemsOptions(charId), select })
}

export function useWeapons(
  charId: string,
  { isEquipped, isGrouped }: { isEquipped?: boolean; isGrouped?: boolean }
) {
  const query = getItemsOptions(charId)
  return useSuspenseQuery({
    ...query,
    select: useCallback(
      (items: ItemRecord) => itemSelector(items, "weapons", { isEquipped, isGrouped }),
      [isEquipped, isGrouped]
    )
  })
}
export function useCombatWeapons(charId: string): Weapon[] {
  const templateId = useCharInfo(charId, state => state.templateId).data
  const { data: equipedWeapons } = useItems(charId, items =>
    Object.values(items)
      .filter(i => i.isEquipped)
      .filter(i => i.category === "weapons")
  )
  if (critters[templateId]) {
    return critters[templateId].attacks.map(a => attackToWeapon(a))
  }
  const hasEquipedWeapons = Object.keys(equipedWeapons).length > 0
  if (hasEquipedWeapons) return Object.values(equipedWeapons)
  return [Weapon.getUnarmed()]
}

export function useClothings(charId: string, isEquipped?: boolean, isGrouped?: boolean) {
  const query = getItemsOptions(charId)
  return useSuspenseQuery({
    ...query,
    select: useCallback(
      (items: ItemRecord) => itemSelector(items, "clothings", { isEquipped, isGrouped }),
      [isEquipped, isGrouped]
    )
  })
}
export function useConsumables(charId: string, isEquipped?: boolean, isGrouped?: boolean) {
  const query = getItemsOptions(charId)
  return useSuspenseQuery({
    ...query,
    select: useCallback(
      (items: ItemRecord) => itemSelector(items, "consumables", { isEquipped, isGrouped }),
      [isEquipped, isGrouped]
    )
  })
}
export function useMiscObjects(charId: string, isEquipped?: boolean, isGrouped?: boolean) {
  const query = getItemsOptions(charId)
  return useSuspenseQuery({
    ...query,
    select: useCallback(
      (items: ItemRecord) => itemSelector(items, "misc", { isEquipped, isGrouped }),
      [isEquipped, isGrouped]
    )
  })
}

export function useItem(charId: string, itemId: string) {
  return useSuspenseQuery({ ...getItemsOptions(charId), select: items => items[itemId] })
}
export function useItemCount(charId: string, itemId: string) {
  return useSuspenseQuery({
    ...getItemsOptions(charId),
    select: data => Object.values(data).filter(e => e.id === itemId).length
  })
}

export const ammoCb = (data: Partial<AmmoSet>) => ({ ...defaultAmmoSet, ...data })

export function useAmmo<TData = AmmoSet>(id: string, select?: (data: AmmoSet) => TData) {
  return useSuspenseQuery({ ...getAmmoOptions(id), select })
}

export function useCaps(id: string) {
  return useSuspenseQuery(getCapsOptions(id))
}

export const getItemsCarry = (items: Record<string, Item>) =>
  Object.values(items).reduce(
    (acc, curr) => {
      const placeToAdd = curr.isEquipped ? 0 : curr.data.place
      const weightToAdd = curr.data.weight
      return { weight: acc.weight + weightToAdd, place: acc.place + placeToAdd }
    },
    { place: 0, weight: 0 }
  )

export const getAmmoCarry = (ammo: AmmoSet) =>
  Object.entries(ammo).reduce(
    (acc, [ammoType, qty]) => {
      const { place = 0, weight = 0 } = ammoMap[ammoType as AmmoType]
      return { place: acc.place + qty * place, weight: acc.weight + qty * weight }
    },
    { place: 0, weight: 0 }
  )

export const getCapsCarry = (qty: number) => ({ weight: qty * 0.02, place: qty * 0.02 })

export function useCarry(charId: string) {
  const itemsCarryOptions = queryOptions({ ...getItemsOptions(charId), select: getItemsCarry })
  const ammoCarryOptions = queryOptions({ ...getAmmoOptions(charId), select: getAmmoCarry })
  const capsCarryOptions = queryOptions({ ...getCapsOptions(charId), select: getCapsCarry })
  return useSuspenseQueries({
    queries: [itemsCarryOptions, ammoCarryOptions, capsCarryOptions],
    combine: res =>
      res.reduce(
        (acc, { data }) => {
          if (!data) return acc
          const { place = 0, weight = 0 } = data
          return { place: round(acc.place + place, 1), weight: round(acc.weight + weight, 1) }
        },
        { weight: 0, place: 0 }
      )
  })
}

export function getItems(store: QueryClient, charId: string) {
  const items = store.getQueryData(getItemsOptions(charId).queryKey)
  if (!items) throw new Error(`Items of char with id : ${charId} could not be found`)
  return items
}

export function getCaps(store: QueryClient, charId: string) {
  return store.getQueryData(getCapsOptions(charId).queryKey) ?? 0
}

export function getAmmo(store: QueryClient, charId: string) {
  const ammoSet = store.getQueryData(getAmmoOptions(charId).queryKey)
  if (!ammoSet) throw new Error(`Ammo of char with id : ${charId} could not be found`)
  return ammoSet
}
