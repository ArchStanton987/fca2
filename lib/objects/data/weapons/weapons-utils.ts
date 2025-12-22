import { Special } from "lib/character/abilities/special/special.types"
import { Item } from "lib/inventory/item.mappers"
import {
  HIT_WITH_AP_COST,
  LOAD_AP_COST,
  THROW_AP_COST,
  UNLOAD_AP_COST
} from "lib/objects/data/weapons/weapons-const"
import { WeaponActionId } from "lib/objects/data/weapons/weapons.types"

import { AmmoSet } from "../ammo/ammo.types"
import Weapon from "./Weapon"

type CAP = { currAp: number }
type MAP = { maxAp: number }
type AP = CAP & MAP

export const getHasStrengthMalus = (item: Item, currSpecial: Special) => {
  if (item.category !== "weapons") throw new Error("Item is not a weapon")
  if (item.data.minStrength === null) return false
  return currSpecial.strength < item.data.minStrength
}

export const getCanBasicUseFirearm = (weapon: Weapon) => {
  if (weapon.data.ammoPerShot === null) return false
  if (!weapon.inMagazine) return false
  return weapon.inMagazine >= weapon.data.ammoPerShot
}

export const getCanBasicUseWeapon = (weapon: Weapon, { currAp, maxAp }: AP) => {
  if (weapon.data.skillId === "trap") {
    return currAp >= maxAp
  }
  if (weapon.data.damageBasic === null) return false
  if (weapon.data.basicApCost === null) return false
  if (weapon.data.ammoType !== null) {
    if (!getCanBasicUseFirearm(weapon)) return false
  }
  return currAp >= weapon.data?.basicApCost
}

export const getCanAim = (weapon: Weapon, { currAp }: CAP) => {
  if (weapon.data.damageBasic === null) return false
  if (weapon.data.specialApCost === null) return false
  if (weapon.data.ammoType !== null) {
    if (!getCanBasicUseFirearm(weapon)) return false
  }
  return currAp >= weapon.data.specialApCost
}

export const getCanShootBurst = (weapon: Weapon, { currAp, maxAp }: AP) => {
  if (weapon.data.ammoPerBurst === null) return false
  if (weapon.data.damageBurst === null) return false
  if (!weapon.inMagazine) return false
  if (weapon.inMagazine < weapon.data.ammoPerBurst) return false
  return currAp >= maxAp
}

export const getCanLoad = (weapon: Weapon, { currAp }: CAP, ammo: Partial<AmmoSet>) => {
  if (weapon.data.ammoType === null) return false
  if (weapon.data.magazine === null) return false
  const ammoCount = weapon.getAmmoCount(ammo) ?? 0
  if (ammoCount <= 0) return false
  if (weapon.inMagazine === weapon.data.magazine) return false
  return currAp >= LOAD_AP_COST
}

export const getCanUnload = ({ data, inMagazine = 0 }: Weapon, { currAp }: CAP) => {
  if (data.ammoType === null) return false
  if (data.magazine === null) return false
  if (inMagazine === 0) return false
  return currAp >= UNLOAD_AP_COST
}

export const getCanHitWith = (weapon: Weapon, { currAp }: CAP) => {
  if (weapon.data.skillId === "melee" || weapon.data.skillId === "unarmed") return false
  return currAp >= HIT_WITH_AP_COST
}
export const getCanThrow = (weapon: Weapon, { currAp }: CAP) => {
  if (weapon.id === "unarmed") return false
  return currAp >= THROW_AP_COST
}

export const weaponActionsMap: {
  actionId: WeaponActionId
  fn: (weapon: Weapon, ap: { currAp: number; maxAp: number }, ammo: Partial<AmmoSet>) => boolean
}[] = [
  { actionId: "basic", fn: getCanBasicUseWeapon },
  { actionId: "aim", fn: getCanAim },
  { actionId: "burst", fn: getCanShootBurst },
  { actionId: "reload", fn: getCanLoad },
  { actionId: "unload", fn: getCanUnload },
  { actionId: "throw", fn: getCanThrow },
  { actionId: "hit", fn: getCanHitWith }
]

export const getAvailableWeaponActions = (
  weapon: Weapon,
  ap: { currAp: number; maxAp: number },
  ammo: Partial<AmmoSet>
) => weaponActionsMap.filter(({ fn }) => fn(weapon, ap, ammo)).map(({ actionId }) => actionId)

export const getWeaponActionLabel = (weapon: Weapon, actionId: WeaponActionId) => {
  if (actionId === "burst") return "Tirer (rafale)"
  if (actionId === "reload") return "Recharger"
  if (actionId === "unload") return "Décharger"
  if (actionId === "hit") return "Frapper"
  if (actionId === "throw") return "Lancer"

  let verb = "Utiliser"
  switch (weapon.data.skillId) {
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
      verb = "Utiliser (lancer)"
      break
    case "trap":
      verb = "Utiliser (poser)"
      break
    default:
      verb = "Utiliser"
      break
  }

  return actionId === "aim" ? `${verb} (viser)` : verb
}
