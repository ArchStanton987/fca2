import { SpecialValues } from "../special/special-types"

export type SecAttrId =
  | "critChance"
  | "armorClass"
  | "meleeDamage"
  | "mentalStrength"
  | "actionPoints"
  | "range"
  | "poisResist"
  | "radsResist"
  | "healHpPerHour"
  | "maxPlace"
  | "normalCarryWeight"
  | "tempCarryWeight"
  | "maxCarryWeight"

export type SecAttr = {
  id: SecAttrId
  label: string
  short: string
  unit?: string
  calc: (specialValues: SpecialValues) => number
}

export type SecAttrsValues = {
  [key in SecAttrId]: number
}
