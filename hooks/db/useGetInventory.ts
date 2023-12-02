import dbKeys from "db/db-keys"

import { ConsumableId } from "models/objects/consumable/consumables-types"
import { MiscObjectId } from "models/objects/misc/misc-object-types"

import useDbSubscribe from "./useDbSubscribe"
import { CharClothing, CharWeapon, DbClothing, DbWeapon } from "./useGetEquipedObj"

export type DbConsumable = {
  id: ConsumableId
  remainingUse?: number
}

export type DbObject = {
  id: MiscObjectId
}

export type CharConsumable = {
  dbKey: string
  id: ConsumableId
  remainingUse?: number
}

export type CharObject = {
  dbKey: string
  id: MiscObjectId
}

export type CharInventory = {
  clothings: CharClothing[]
  weapons: CharWeapon[]
  consumables: CharConsumable[]
  objects: CharObject[]
}

export type DbInventory = {
  clothings?: Record<string, DbClothing>
  weapons?: Record<string, DbWeapon>
  consumables?: Record<string, DbConsumable>
  objects?: Record<string, DbObject>
}

const handler = (snap: DbInventory): CharInventory => {
  const dbClothings = snap?.clothings || {}
  const clothings = Object.entries(dbClothings).map(([key, value]) => ({
    dbKey: key,
    id: value.id
  }))
  const dbWeapons = snap?.weapons || {}
  const weapons = Object.entries(dbWeapons).map(([key, value]) => ({
    dbKey: key,
    id: value.id
  }))
  const dbConsumables = snap?.consumables || {}
  const consumables = Object.entries(dbConsumables).map(([key, value]) => ({
    dbKey: key,
    id: value.id,
    remainingUse: value.remainingUse
  }))
  const dbObjects = snap?.objects || {}
  const objects = Object.entries(dbObjects).map(([key, value]) => ({
    dbKey: key,
    id: value.id
  }))
  return { weapons, clothings, consumables, objects }
}

export const useGetInventory = (charId: string) => {
  const dbPath = dbKeys.char(charId).inventory

  return useDbSubscribe<DbInventory, CharInventory>(dbPath, handler)
}
