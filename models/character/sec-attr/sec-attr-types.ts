// import { EquipableObjectId } from "models/objects/object-types"

// import { Effect } from "../effects/effect-types"
// import { Symptom } from "../effects/symptom"
// import { PerkId } from "../perks/perks-types"
// import { SpecialValues } from "../special/special-types"
// import { TraitId } from "../traits/traits-types"

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
  // getBase: (specialValues: SpecialValues, traits: TraitId[], perks: PerkId[]) => number
  // getMod: (effects: Effect[], equipableObjects: EquipableObjectId[]) => number
  // getCurrent: ({
  //   specialValues,
  //   traits,
  //   perks,
  //   effects,
  //   equipableObjects
  // }: {
  //   specialValues: SpecialValues
  //   traits: TraitId[]
  //   perks: PerkId[]
  //   effects: Effect[]
  //   equipableObjects: EquipableObjectId[]
  // }) => number
}

export type SecAttrsValues = {
  [key in SecAttrId]: number
}
