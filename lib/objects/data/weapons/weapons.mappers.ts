import { DbWeapon } from "../objects.types"
import Weapon from "./Weapon"
import { BeastAttack, DbWeaponData, WeaponData, WeaponId } from "./weapons.types"

export default class WeaponMappers {
  static dbWeaponDataToDomain(payload: DbWeaponData): WeaponData {
    return {
      id: payload.id,
      label: payload.label,
      img: payload.img,
      damageType: payload.damageType,
      damageBasic: payload.damageBasic ?? null,
      damageBurst: payload.damageBurst ?? null,
      ammoType: payload.ammoType ?? null,
      range: payload.range ?? null,
      magazine: payload.magazine ?? null,
      ammoPerShot: payload.ammoPerShot ?? null,
      ammoPerBurst: payload.ammoPerBurst ?? null,
      basicApCost: payload.basicApCost ?? null,
      specialApCost: payload.specialApCost ?? null,
      minStrength: payload.minStrength,
      place: payload.place,
      weight: payload.weight,
      value: payload.value,
      frequency: payload.frequency,
      skillId: payload.skillId,
      knowledges: Object.values(payload.knowledges ?? {}),
      tags: Object.values(payload.tags ?? {}),
      isTwoHanded: payload.isTwoHanded,
      effects: payload.effects,
      modifiers: payload.modifiers
    }
  }
}

export const attackToWeapon = (attack: BeastAttack): Weapon => {
  const { name, apCost, damage, effects, modifiers } = attack

  const dbWeapon: DbWeapon = {
    id: name as WeaponId,
    category: "weapons",
    isEquipped: true,
    data: {
      id: name as WeaponId,
      label: name,
      img: "",
      damageType: "physical",
      damageBasic: damage,
      basicApCost: apCost,
      minStrength: 0,
      place: 0,
      weight: 0,
      value: 0,
      frequency: 0,
      skillId: "unarmed",
      isTwoHanded: false,
      effects,
      modifiers
    }
  }
  return new Weapon(
    { ...dbWeapon, key: name },
    {
      [name]: {
        id: name as WeaponId,
        label: name,
        img: "",
        damageType: "physical",
        damageBasic: null,
        damageBurst: null,
        ammoType: null,
        range: null,
        magazine: null,
        ammoPerShot: null,
        ammoPerBurst: null,
        basicApCost: null,
        specialApCost: null,
        minStrength: 1,
        place: 0,
        weight: 0,
        value: 0,
        frequency: 1,
        skillId: "unarmed",
        isTwoHanded: false,
        knowledges: [],
        tags: ["attack"]
      }
    }
  )
}
