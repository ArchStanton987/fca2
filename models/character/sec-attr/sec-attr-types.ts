import { Symptom } from "../effects/symptom"
import { PerkId } from "../perks/perks-types"
import { SpecialValues } from "../special/special-types"
import { TraitId } from "../traits/traits-types"

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
  | "place"

export type SecAttr = {
  id: SecAttrId
  label: string
  short: string
  unit?: string
  get: (specialValues: SpecialValues, traits: TraitId[], perks: PerkId[]) => number
  getMod: (symptoms: Symptom[]) => number
}

export type SecAttrsValues = {
  [key in SecAttrId]: number
}
