import { ClothingId } from "models/objects/clothing/clothing-types"
import { WeaponId } from "models/objects/weapon/weapon-types"

import dbKeys from "../../db/db-keys"
import useDbSubscribe from "./useDbSubscribe"

export type DbClothing = { id: ClothingId }
export type DbWeapon = { id: WeaponId }

export type DbEquipedObjects = {
  clothings?: Record<string, DbClothing>
  weapons?: Record<string, DbWeapon>
}
export type CharClothing = {
  dbKey: string
  id: ClothingId
}
export type CharWeapon = {
  dbKey: string
  id: WeaponId
}
export type CharEquipedObjects = {
  clothings: CharClothing[]
  weapons: CharWeapon[]
}

const handler = (snap: DbEquipedObjects): CharEquipedObjects => {
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
  return { weapons, clothings }
}

export default function useGetEquipedObj(charId: string) {
  const dbPath = dbKeys.char(charId).effects

  return useDbSubscribe<DbEquipedObjects, CharEquipedObjects>(dbPath, handler)
}
