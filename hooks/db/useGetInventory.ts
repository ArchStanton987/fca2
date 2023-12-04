import dbKeys from "db/db-keys"

import ammoMap from "models/objects/ammo/ammo"
import { AmmoType } from "models/objects/ammo/ammo-types"
import clothingsMap from "models/objects/clothing/clothings"
import consumablesMap from "models/objects/consumable/consumables"
import { ConsumableId } from "models/objects/consumable/consumables-types"
import { MiscObjectId } from "models/objects/misc/misc-object-types"
import miscObjectsMap from "models/objects/misc/misc-objects"
import weaponsMap from "models/objects/weapon/weapons"

import useDbSubscribe from "./useDbSubscribe"
import { CharClothing, CharWeapon, DbClothing, DbWeapon } from "./useGetEquipedObj"

export type DbAmmo = Record<AmmoType, number>

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

export type CharAmmo = {
  id: AmmoType
  amount: number
}[]

export type CharInventory = {
  ammo: CharAmmo
  clothings: CharClothing[]
  weapons: CharWeapon[]
  consumables: CharConsumable[]
  objects: CharObject[]
}

export type DbInventory = {
  ammo: DbAmmo
  clothings?: Record<string, DbClothing>
  weapons?: Record<string, DbWeapon>
  consumables?: Record<string, DbConsumable>
  objects?: Record<string, DbObject>
}

const handler = (snap: DbInventory): CharInventory => {
  const dbAmmo = snap?.ammo || {}
  const ammo = Object.entries(dbAmmo).map(([id, amount]) => ({
    id: id as AmmoType,
    amount
  }))

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
  return { ammo, weapons, clothings, consumables, objects }
}

export const getTotalWeight = (inventory: CharInventory) => {
  const { ammo, clothings, weapons, consumables, objects } = inventory
  const ammoWeight = ammo.reduce((acc, { amount, id }) => acc + ammoMap[id].weight * amount, 0)
  const clothingsWeight = clothings.reduce((acc, curr) => acc + clothingsMap[curr.id].weight, 0)
  const weaponsWeight = weapons.reduce((acc, curr) => acc + weaponsMap[curr.id].weight, 0)
  const consumablesWeight = consumables.reduce(
    (acc, curr) => acc + consumablesMap[curr.id].weight,
    0
  )
  const objectsWeight = objects.reduce((acc, curr) => acc + miscObjectsMap[curr.id].weight, 0)
  return ammoWeight + clothingsWeight + weaponsWeight + consumablesWeight + objectsWeight
}

export const useGetInventory = (charId: string) => {
  const dbPath = dbKeys.char(charId).inventory

  return useDbSubscribe<DbInventory, CharInventory>(dbPath, handler)
}
