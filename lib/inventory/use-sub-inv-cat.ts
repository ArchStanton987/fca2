import { useCallback } from "react"

import {
  QueryClient,
  queryOptions,
  useSuspenseQueries,
  useSuspenseQuery
} from "@tanstack/react-query"
import { useCharInfo } from "lib/character/info/info-provider"
import { critters } from "lib/npc/const/npc-templates"
import ammoMap, { defaultAmmoSet } from "lib/objects/data/ammo/ammo"
import { AmmoSet, AmmoType } from "lib/objects/data/ammo/ammo.types"
import Clothing from "lib/objects/data/clothings/Clothing"
import Consumable from "lib/objects/data/consumables/Consumable"
import MiscObject from "lib/objects/data/misc-objects/MiscObject"
import { DbInventory, DbItem, ItemCategory } from "lib/objects/data/objects.types"
import Weapon from "lib/objects/data/weapons/Weapon"
import { attackToWeapon } from "lib/objects/data/weapons/weapons.mappers"
import { useMultiSub, useSubMultiCollections } from "lib/shared/db/useSub"

import { AdditionalElContextType, useCollectiblesData } from "providers/AdditionalElementsProvider"
import { filterUnique } from "utils/array-utils"

const itemFactory = (
  item: DbItem,
  { weapons, clothings, consumables, miscObjects }: AdditionalElContextType
) => {
  switch (item.category) {
    case "clothings":
      return new Clothing(item, clothings)
    case "consumables":
      return new Consumable(item, consumables)
    case "misc":
      return new MiscObject(item, miscObjects)
    case "weapons":
      return new Weapon(item, weapons)
    default:
      throw new Error("unknown db item type")
  }
}

const getInvOptions = <K extends keyof DbInventory, T>(charId: string, invElement: K) =>
  queryOptions({
    queryKey: ["v3", "playables", charId, "inventory", invElement],
    enabled: charId !== "",
    queryFn: () => new Promise<T>(() => {})
  })

export type Item = Clothing | Consumable | MiscObject | Weapon

export const getItemsOptions = (charId: string) =>
  getInvOptions<"items", Record<string, Item>>(charId, "items")
const getAmmoOptions = (charId: string) => getInvOptions<"ammo", AmmoSet>(charId, "ammo")
const getCapsOptions = (charId: string) => getInvOptions<"caps", number>(charId, "caps")

export function useMultiSubItems(ids: string[]) {
  const collectiblesData = useCollectiblesData()
  const options = ids.map(id => getItemsOptions(id))
  const cb = useCallback((db: DbItem) => itemFactory(db, collectiblesData), [collectiblesData])
  useSubMultiCollections(options.map(o => ({ path: o.queryKey.join("/"), cb })))
}

type ItemRecord = Record<string, Item>
type Options = { isEquipped?: boolean; isGrouped?: boolean }

const groupById = (items: Item[]) =>
  filterUnique(
    "id",
    items.map((item, _, currArr) => {
      const itemsGroup = currArr.filter(i => i.id === item.id)
      const count = itemsGroup.length
      const dbKeys = itemsGroup.map(i => i.dbKey)
      return { ...item, count, dbKeys }
    })
  )

const selector = (items: ItemRecord, cat: ItemCategory, { isEquipped, isGrouped }: Options) => {
  if (isGrouped) {
    return Object.fromEntries(groupById(Object.values(items)).map(e => [e.id, e]))
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
      (items: ItemRecord) => selector(items, "weapons", { isEquipped, isGrouped }),
      [isEquipped, isGrouped]
    )
  })
}
export function useCombatWeapons(charId: string): Weapon[] {
  const templateId = useCharInfo(charId, state => state.templateId).data
  const equipedWeapons = useWeapons(charId, { isEquipped: true }).data
  const hasEquipedWeapons = Object.keys(equipedWeapons).length === 0
  if (hasEquipedWeapons) return Object.values(equipedWeapons)
  const unarmed = Weapon.getUnarmed()
  if (critters[templateId]) {
    return critters[templateId].attacks.map(a => attackToWeapon(a))
  }
  return [unarmed]
}

export function useClothings(charId: string, isEquipped?: boolean, isGrouped?: boolean) {
  const query = getItemsOptions(charId)
  return useSuspenseQuery({
    ...query,
    select: useCallback(
      (items: ItemRecord) => selector(items, "clothings", { isEquipped, isGrouped }),
      [isEquipped, isGrouped]
    )
  })
}
export function useConsumables(charId: string, isEquipped?: boolean, isGrouped?: boolean) {
  const query = getItemsOptions(charId)
  return useSuspenseQuery({
    ...query,
    select: useCallback(
      (items: ItemRecord) => selector(items, "consumables", { isEquipped, isGrouped }),
      [isEquipped, isGrouped]
    )
  })
}
export function useMiscObjects(charId: string, isEquipped?: boolean, isGrouped?: boolean) {
  const query = getItemsOptions(charId)
  return useSuspenseQuery({
    ...query,
    select: useCallback(
      (items: ItemRecord) => selector(items, "misc", { isEquipped, isGrouped }),
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

const ammoCb = (data: Partial<AmmoSet>) => ({ ...defaultAmmoSet, ...data })

export function useMultiSubAmmo(ids: string[]) {
  const options = ids.map(id => getAmmoOptions(id))
  useMultiSub(options.map(o => ({ path: o.queryKey.join("/"), cb: ammoCb })))
}

export function useAmmo<TData = AmmoSet>(id: string, select?: (data: AmmoSet) => TData) {
  return useSuspenseQuery({ ...getAmmoOptions(id), select })
}

export function useMultiSubCaps(ids: string[]) {
  const options = ids.map(id => getCapsOptions(id))
  useMultiSub(options.map(o => ({ path: o.queryKey.join("/") })))
}

export function useCaps(id: string) {
  return useSuspenseQuery(getCapsOptions(id))
}

const getItemsCarry = (items: Record<string, Item>) =>
  Object.values(items).reduce(
    (acc, curr) => {
      const placeToAdd = curr.isEquipped ? 0 : curr.data.place
      const weightToAdd = curr.data.weight
      return { weight: acc.weight + weightToAdd, place: acc.place + placeToAdd }
    },
    { place: 0, weight: 0 }
  )

const getAmmoCarry = (ammo: AmmoSet) =>
  Object.entries(ammo).reduce(
    (acc, [ammoType, qty]) => {
      const { place = 0, weight = 0 } = ammoMap[ammoType as AmmoType]
      return { place: acc.place + qty * place, weight: acc.weight + qty * weight }
    },
    { place: 0, weight: 0 }
  )

const getCapsCarry = (qty: number) => ({ weight: qty * 0.02, place: qty * 0.02 })

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
          return { place: acc.place + place, weight: acc.weight + weight }
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
