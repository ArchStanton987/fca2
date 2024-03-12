import dbKeys from "db/db-keys"
import { SkillsValues } from "lib/character/abilities/skills/skills.types"
import ammoMap from "lib/objects/ammo/ammo"
import { AmmoType } from "lib/objects/ammo/ammo.types"
import clothingsMap from "lib/objects/clothings/clothings"
import consumablesMap from "lib/objects/consumables/consumables"
import { ConsumableId } from "lib/objects/consumables/consumables.types"
import miscObjectsMap from "lib/objects/misc-objects/misc-objects"
import { MiscObjectId } from "lib/objects/misc-objects/misc-objects-types"
import weaponsMap from "lib/objects/weapons/weapons"
import { WeaponId } from "lib/objects/weapons/weapons.types"

import useGetAbilities, { DbAbilities } from "hooks/db/useGetAbilities"
import { useCurrAttr } from "providers/CurrAttrProvider"

import useDbSubscribe from "./useDbSubscribe"
import { CharClothing, CharEquipedObjects, DbClothing, DbWeapon } from "./useGetEquipedObj"

export type DbAmmo = Record<AmmoType, number>

export type DbConsumable = {
  id: ConsumableId
  remainingUse?: number
}

export type DbObject = {
  id: MiscObjectId
}

export type CharWeapon = {
  dbKey: string
  id: WeaponId
  skill: number
  basicApCost: number | null
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

export const getCurrCarry = (inventory: CharInventory, equObj: CharEquipedObjects) => {
  const { ammo, clothings, weapons, consumables, objects } = inventory
  const init = { weight: 0, place: 0 }
  const ammoWeight = ammo.reduce((acc, { amount, id }) => {
    const weight = ammoMap[id].weight * amount
    const place = ammoMap[id].place * amount
    return { weight: acc.weight + weight, place: acc.place + place }
  }, init)
  const clothingsWeight = clothings.reduce((acc, curr) => {
    const { weight, place } = clothingsMap[curr.id]
    const isEquiped = equObj.clothings.some(({ id }) => id === curr.id)
    const placeToAdd = isEquiped ? 0 : place
    return { weight: acc.weight + weight, place: acc.place + placeToAdd }
  }, init)
  const weaponsWeight = weapons.reduce((acc, curr) => {
    const { weight, place } = weaponsMap[curr.id]
    const isEquiped = equObj.weapons.some(({ id }) => id === curr.id)
    const placeToAdd = isEquiped ? 0 : place
    return { weight: acc.weight + weight, place: acc.place + placeToAdd }
  }, init)
  const consumablesWeight = consumables.reduce((acc, curr) => {
    const { weight, place } = consumablesMap[curr.id]
    return { weight: acc.weight + weight, place: acc.place + place }
  }, init)
  const objectsWeight = objects.reduce((acc, curr) => {
    const { weight, place } = miscObjectsMap[curr.id]
    return { weight: acc.weight + weight, place: acc.place + place }
  }, init)
  const w =
    Math.round(
      (ammoWeight.weight +
        clothingsWeight.weight +
        weaponsWeight.weight +
        consumablesWeight.weight +
        objectsWeight.weight) *
        10
    ) / 10
  const p =
    Math.round(
      (ammoWeight.place +
        clothingsWeight.place +
        weaponsWeight.place +
        consumablesWeight.place +
        objectsWeight.place) *
        10
    ) / 10
  return { currWeight: w, currPlace: p }
}

const handler = (
  snap: DbInventory,
  currSkills: SkillsValues,
  abilities: DbAbilities
): CharInventory => {
  const dbAmmo = snap?.ammo || {}
  const ammo = Object.entries(dbAmmo)
    .map(([id, amount]) => ({
      id: id as AmmoType,
      amount
    }))
    .filter(el => el.amount > 0)

  const dbClothings = snap?.clothings || {}
  const clothings = Object.entries(dbClothings).map(([key, value]) => ({
    dbKey: key,
    id: value.id
  }))
  const dbWeapons = snap?.weapons || {}
  const weapons = Object.entries(dbWeapons).map(([key, value]) => {
    const weaponSkill = weaponsMap[value.id].skill
    const weaponKnowledges = weaponsMap[value.id].knowledges
    const { knowledges } = abilities
    const knowledgesBonus = weaponKnowledges.reduce((acc, curr) => acc + (knowledges[curr] ?? 0), 0)
    const skillScore = currSkills[weaponSkill] + knowledgesBonus

    const hasMrFast = abilities.traits?.includes("mrFast")
    let apCost = weaponsMap[value.id].basicApCost
    if (apCost !== null) {
      apCost = hasMrFast ? apCost - 1 : apCost
    }
    return { dbKey: key, id: value.id, skill: skillScore, basicApCost: apCost }
  })
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

export const useGetInventory = (charId: string): CharInventory => {
  const currAttr = useCurrAttr()
  const { currSkills } = currAttr
  const abilities = useGetAbilities(charId)

  const dbPath = dbKeys.char(charId).inventory
  const inv = useDbSubscribe<DbInventory, DbInventory>(dbPath)

  if (!inv || !currSkills || !abilities)
    return { weapons: [], clothings: [], consumables: [], objects: [], ammo: [] }

  const { weapons, clothings, consumables, objects, ammo } = handler(inv, currSkills, abilities)

  return { weapons, clothings, consumables, objects, ammo }
}
