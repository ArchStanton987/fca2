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

export type SecAttr = {
  id: SecAttrId
  label: string
  short: string
  unit?: string
  calc: (specialValues: SpecialValues) => number
}
