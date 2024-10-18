import Character from "lib/character/Character"
import { Special } from "lib/character/abilities/special/special.types"
import { LOAD_AP_COST, UNLOAD_AP_COST } from "lib/objects/data/weapons/weapons-const"
import { Weapon, WeaponActionId } from "lib/objects/data/weapons/weapons.types"

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

const getCanBasicUseFirearm = (weapon: Weapon) => {
  if (weapon.data.ammoPerShot === null) return false
  if (weapon.inMagazine === undefined) return false
  return weapon.inMagazine >= weapon.data.ammoPerShot
}

export const getCanBasicUseWeapon = (weapon: Weapon, char: Character) => {
  if (weapon.data.skill === "trap") {
    return char.status.currAp >= char.secAttr.curr.actionPoints
  }
  if (weapon.data.damageBasic === null) return false
  if (weapon.data.basicApCost === null) return false
  if (weapon.data.ammoType !== null) {
    if (!getCanBasicUseFirearm(weapon)) return false
  }
  return char.status.currAp >= weapon.data?.basicApCost
}

export const getCanAim = (weapon: Weapon, char: Character) => {
  if (weapon.data.damageBasic === null) return false
  if (weapon.data.specialApCost === null) return false
  if (weapon.data.ammoType !== null) {
    if (!getCanBasicUseFirearm(weapon)) return false
  }
  return char.status.currAp >= weapon.data.specialApCost
}

export const getCanShootBurst = (weapon: Weapon, char: Character) => {
  if (weapon.data.ammoPerBurst === null) return false
  if (weapon.data.damageBurst === null) return false
  if (weapon.inMagazine === undefined) return false
  if (weapon.inMagazine < weapon.data.ammoPerBurst) return false
  return char.status.currAp >= char.secAttr.curr.actionPoints
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
  actionId: WeaponActionId
  fn: (weapon: Weapon, char: Character) => boolean
}[] = [
  { actionId: "basic", fn: getCanBasicUseWeapon },
  { actionId: "aim", fn: getCanAim },
  { actionId: "burst", fn: getCanShootBurst },
  { actionId: "load", fn: getCanLoad },
  { actionId: "unload", fn: getCanUnload }
]

export const getAvailableWeaponActions = (weapon: Weapon, char: Character) =>
  actionsMap.filter(({ fn }) => fn(weapon, char)).map(({ actionId }) => actionId)

export const getWeaponActionLabel = (weapon: Weapon, actionId: WeaponActionId) => {
  if (actionId === "burst") return "Tirer (rafale)"
  if (actionId === "load") return "Recharger"
  if (actionId === "unload") return "Décharger"

  let verb = "Utiliser"
  switch (weapon.data.skill) {
    case "unarmed":
      verb = "Frapper"
      break
    case "smallGuns":
      verb = "Tirer"
      break
    case "bigGuns":
      verb = "Tirer"
      break
    case "melee":
      verb = "Frapper"
      break
    case "throw":
      verb = "Lancer"
      break
    case "trap":
      verb = "Poser"
      break
    default:
      verb = "Utiliser"
      break
  }

  return actionId === "aim" ? `${verb} (viser)` : verb
}
