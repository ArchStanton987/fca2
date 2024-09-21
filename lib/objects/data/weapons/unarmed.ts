import { Weapon, WeaponData } from "./weapons.types"

export const unarmedData: WeaponData = {
  id: "unarmed",
  label: "Mains nues",
  img: "",
  damageType: "physical",
  damageBasic: "1D6+DM",
  damageBurst: null,
  ammoType: null,
  range: null,
  magazine: null,
  ammoPerShot: null,
  ammoPerBurst: null,
  basicApCost: 3,
  specialApCost: 5,
  minStrength: 1,
  place: 0,
  weight: 0,
  value: 0,
  frequency: 5,
  skill: "unarmed",
  knowledges: ["kUnarmed"],
  tags: ["arme de corps à corps"]
}

export const unarmed: Omit<Weapon, "skill"> = {
  id: "unarmed" as const,
  dbKey: "unarmed",
  data: unarmedData,
  ammo: 0,
  isEquiped: false
}
