import Character from "lib/character/Character"
import { Special } from "lib/character/abilities/special/special.types"
import { MALUS_PER_MISSING_STRENGTH } from "lib/objects/data/weapons/weapons-const"
import { Weapon, WeaponData, WeaponUseType } from "lib/objects/data/weapons/weapons.types"

export const getApCost = (weapon: Weapon, char: Character, useType: WeaponUseType) => {
  const apCosts = {
    basic: weapon.data.basicApCost,
    burst: char.secAttr.curr.actionPoints,
    aim: weapon.data.specialApCost
  }
  return apCosts[useType]
}

export const getHasStrengthMalus = (weapon: Weapon, currSpecial: Special) => {
  if (weapon.data.minStrength === null) return false
  return currSpecial.strength < weapon.data.minStrength
}

export const getStrengthMalus = (weapon: WeaponData, currSpecial: Special) => {
  if (weapon.minStrength === null) return 0
  return Math.min(0, currSpecial.strength - (weapon.minStrength ?? 0)) * MALUS_PER_MISSING_STRENGTH
}

// const actions = [
//   { weaponTypeCanShoot: (weapon: Weapon) => weapon.data.ammoType !== null },
//   { weaponTypeCanShootBasic: (weapon: Weapon) => weapon.data.damageBasic !== null },
//   { weaponTypeCanShootBurst: (weapon: Weapon) => weapon.data.damageBurst !== null },
//   { weaponTypeCanAim: (weapon: Weapon) => weapon.data.specialApCost !== null },
//   { canShootBasic: (weapon: Weapon) => weapon?.inMagazine && weapon.inMagazine > weapon.data.ammoPerShot },
//   { canShootBurst: (weapon: Weapon) => weapon?.inMagazine && weapon.inMagazine > weapon.data.ammoPerBurst }
// ]

// export const getWeaponActions = (weapon: Weapon) => {
//   const weaponTypeCanShoot = weapon.data.ammoType !== null
//   const weaponTypeCanShootBasic = weapon.data.damageBasic !== null
//   const weaponTypeCanShootBurst = weapon.data.damageBurst !== null
//   const weaponTypeCanAim = weapon.data.specialApCost !== null
//   const canShootBasic = weapon?.inMagazine && weapon.inMagazine > weapon.data.ammoPerShot
//   const canShootBurst = weapon?.inMagazine && weapon.inMagazine > weapon.data.ammoPerBurst
// }
