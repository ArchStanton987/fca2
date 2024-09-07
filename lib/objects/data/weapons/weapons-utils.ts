import Character from "lib/character/Character"
import { Special } from "lib/character/abilities/special/special.types"
import {
  LOAD_AP_COST,
  MALUS_PER_MISSING_STRENGTH,
  UNLOAD_AP_COST
} from "lib/objects/data/weapons/weapons-const"
import {
  Weapon,
  WeaponActionId,
  WeaponActionNameId,
  WeaponData
} from "lib/objects/data/weapons/weapons.types"

export const getApCost = (weapon: Weapon, char: Character, actionId: WeaponActionId) => {
  const apCosts = {
    basic: weapon.data.basicApCost,
    aim: weapon.data.specialApCost,
    burst: char.secAttr.curr.actionPoints,
    load: LOAD_AP_COST,
    unload: UNLOAD_AP_COST
  }
  return apCosts[actionId] || char.secAttr.curr.actionPoints
}

export const getHasStrengthMalus = (weapon: Weapon, currSpecial: Special) => {
  if (weapon.data.minStrength === null) return false
  return currSpecial.strength < weapon.data.minStrength
}

export const getStrengthMalus = (weapon: WeaponData, currSpecial: Special) => {
  if (weapon.minStrength === null) return 0
  return Math.min(0, currSpecial.strength - (weapon.minStrength ?? 0)) * MALUS_PER_MISSING_STRENGTH
}

export const getCanStrike = (weapon: Weapon, char: Character) => {
  if (weapon.data.ammoType !== null) return false
  if (weapon.data.damageBasic === null) return false
  if (weapon.data.basicApCost === null) return false
  return char.status.currAp >= weapon.data.basicApCost
}

export const getCanStrikeAim = (weapon: Weapon, char: Character) => {
  if (weapon.data.ammoType !== null) return false
  if (weapon.data.damageBasic === null) return false
  if (weapon.data.specialApCost === null) return false
  return char.status.currAp >= weapon.data.specialApCost
}

export const getCanShoot = (weapon: Weapon, char: Character) => {
  if (weapon.data.basicApCost === null) return false
  if (weapon.data.ammoPerShot === null) return false
  if (weapon.inMagazine === undefined) return false
  if (weapon.inMagazine < weapon.data.ammoPerShot) return false
  return char.status.currAp >= weapon.data.basicApCost
}

export const getCanShootBurst = (weapon: Weapon, char: Character) => {
  if (weapon.data.ammoPerBurst === null) return false
  if (weapon.data.damageBurst === null) return false
  if (weapon.inMagazine === undefined) return false
  if (weapon.inMagazine < weapon.data.ammoPerBurst) return false
  return char.status.currAp >= char.secAttr.curr.actionPoints
}

export const getCanShootAim = (weapon: Weapon, char: Character) => {
  if (weapon.data.ammoType === null) return false
  if (weapon.data.specialApCost === null) return false
  if (weapon.data.ammoPerShot === null) return false
  if (weapon.inMagazine === undefined) return false
  if (weapon.inMagazine < weapon.data.ammoPerShot) return false
  return char.status.currAp >= weapon.data.specialApCost
}

export const getCanLoad = (weapon: Weapon, char: Character) => {
  if (weapon.data.ammoType === null) return false
  if (weapon.data.magazine === null) return false
  if (weapon.ammo <= 0) return false
  if (weapon.inMagazine === weapon.data.magazine) return false
  return char.status.currAp >= LOAD_AP_COST
}

export const getCanUnload = ({ data, inMagazine = 0 }: Weapon, char: Character) => {
  if (data.ammoType === null) return false
  if (data.magazine === null) return false
  if (inMagazine === 0) return false
  return char.status.currAp >= UNLOAD_AP_COST
}

const actionsMap: {
  key: WeaponActionNameId
  actionId: WeaponActionId
  fn: (weapon: Weapon, char: Character) => boolean
}[] = [
  { key: "strike", actionId: "basic", fn: getCanStrike },
  { key: "strikeAim", actionId: "aim", fn: getCanStrikeAim },
  { key: "shoot", actionId: "basic", fn: getCanShoot },
  { key: "shootBurst", actionId: "burst", fn: getCanShootBurst },
  { key: "shootAim", actionId: "aim", fn: getCanShootAim },
  { key: "load", actionId: "load", fn: getCanLoad },
  { key: "unload", actionId: "unload", fn: getCanUnload }
]

export const getAvailableWeaponActions = (weapon: Weapon, char: Character) =>
  actionsMap.filter(({ fn }) => fn(weapon, char)).map(({ key }) => key)
