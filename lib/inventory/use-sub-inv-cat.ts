import { useCallback } from "react"

import { queryOptions, useQueries, useQuery } from "@tanstack/react-query"
import { useCharInfo } from "lib/character/character-provider"
import { Symptom } from "lib/character/effects/symptoms.type"
import { critters } from "lib/npc/const/npc-templates"
import { CreatedElements, defaultCreatedElements } from "lib/objects/created-elements"
import ammoMap from "lib/objects/data/ammo/ammo"
import { AmmoSet, AmmoType } from "lib/objects/data/ammo/ammo.types"
import Clothing from "lib/objects/data/clothings/Clothing"
import clothingsMap from "lib/objects/data/clothings/clothings"
import Consumable from "lib/objects/data/consumables/Consumable"
import consumablesMap from "lib/objects/data/consumables/consumables"
import MiscObject from "lib/objects/data/misc-objects/MiscObject"
import miscObjectsMap from "lib/objects/data/misc-objects/misc-objects"
import { DbInventory, DbItem, ItemCategory } from "lib/objects/data/objects.types"
import Weapon from "lib/objects/data/weapons/Weapon"
import weaponsMap from "lib/objects/data/weapons/weapons"
import { attackToWeapon } from "lib/objects/data/weapons/weapons.mappers"
import { useSub, useSubCollection } from "lib/shared/db/useSub"

import useCreatedElements from "hooks/context/useCreatedElements"
import { filterUnique } from "utils/array-utils"

const itemFactory = (item: DbItem, newItems: CreatedElements = defaultCreatedElements) => {
  const { newClothings, newConsumables, newMiscObjects, newWeapons } = newItems
  const allClothings = { ...clothingsMap, ...newClothings }
  const allConsumables = { ...consumablesMap, ...newConsumables }
  const allMiscObjects = { ...miscObjectsMap, ...newMiscObjects }
  const allWeapons = { ...weaponsMap, ...newWeapons }

  switch (item.category) {
    case "clothings":
      return new Clothing(item, allClothings)
    case "consumables":
      return new Consumable(item, allConsumables)
    case "misc":
      return new MiscObject(item, allMiscObjects)
    case "weapons":
      return new Weapon(item, allWeapons)
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

const getItemsOptions = (charId: string) =>
  getInvOptions<"items", Record<string, Item>>(charId, "items")
const getAmmoOptions = (charId: string) => getInvOptions<"ammo", AmmoSet>(charId, "ammo")
const getCapsOptions = (charId: string) => getInvOptions<"caps", number>(charId, "caps")

export function useSubItems(charId: string) {
  const newElements = useCreatedElements()
  const options = getItemsOptions(charId)
  const path = options.queryKey.join("/")
  const cb = useCallback((db: DbItem) => itemFactory(db, newElements), [newElements])
  useSubCollection(path, cb)
}
export function useItemsQuery(charId: string) {
  return useQuery(getItemsOptions(charId))
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

export function useWeapons(charId: string, isEquipped?: boolean, isGrouped?: boolean) {
  const query = getItemsOptions(charId)
  return useQuery({
    ...query,
    select: useCallback(
      (items: ItemRecord) => selector(items, "weapons", { isEquipped, isGrouped }),
      [isEquipped, isGrouped]
    )
  })
}
export function useCombatWeapons(charId: string): Weapon[] {
  const { templateId } = useCharInfo()
  const equipedWeapons = useWeapons(charId, true)
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
  return useQuery({
    ...query,
    select: useCallback(
      (items: ItemRecord) => selector(items, "clothings", { isEquipped, isGrouped }),
      [isEquipped, isGrouped]
    )
  })
}
export function useConsumables(charId: string, isEquipped?: boolean, isGrouped?: boolean) {
  const query = getItemsOptions(charId)
  return useQuery({
    ...query,
    select: useCallback(
      (items: ItemRecord) => selector(items, "consumables", { isEquipped, isGrouped }),
      [isEquipped, isGrouped]
    )
  })
}
export function useMiscObjects(charId: string, isEquipped?: boolean, isGrouped?: boolean) {
  const query = getItemsOptions(charId)
  return useQuery({
    ...query,
    select: useCallback(
      (items: ItemRecord) => selector(items, "misc", { isEquipped, isGrouped }),
      [isEquipped, isGrouped]
    )
  })
}

export function useSubAmmo(charId: string) {
  const options = getAmmoOptions(charId)
  const path = options.queryKey.join("/")
  useSub(path)
}
export function useAmmoQuery(charId: string) {
  return useQuery(getAmmoOptions(charId))
}

export function useSubCaps(charId: string) {
  const options = getCapsOptions(charId)
  const path = options.queryKey.join("/")
  useSub(path)
}
export function useCapsQuery(charId: string) {
  return useQuery(getCapsOptions(charId))
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
  return useQueries({
    queries: [itemsCarryOptions, ammoCarryOptions, capsCarryOptions],
    combine: res => ({
      isPending: res.some(r => r.isPending),
      isError: res.some(r => r.isError),
      data: res.reduce(
        (acc, { data }) => {
          if (!data) return acc
          const { place = 0, weight = 0 } = data
          return { place: acc.place + place, weight: acc.weight + weight }
        },
        { weight: 0, place: 0 }
      )
    })
  })
}

const getItemSymptoms = (items: Record<string, Item>) =>
  Object.values(items).reduce((acc, item) => {
    if (item.category === "weapons" || item.category === "consumables") return acc
    return item.isEquipped ? [...acc, ...item.data.symptoms] : acc
  }, [] as Symptom[])

export function useItemSymptoms(charId: string) {
  return useQuery({ ...getItemsOptions(charId), select: getItemSymptoms })
}
