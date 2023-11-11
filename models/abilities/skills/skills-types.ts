import { BodyPart } from "models/objects/clothings/clothing-types"

import { SpecialValues } from "../special/special-types"

export type SkillId =
  | "blunt"
  | "lightMedWeapons"
  | "heavyWeapons"
  | "unarmed"
  | "barter"
  | "speech"
  | "stealth"
  | "throw"
  | "manipulation"
  | "perceptionSkill"
  | "trap"
  | "physical"
  | "reflexion"
  | "aid"
  | "survival"
  | "steal"

export type Skill = {
  id: SkillId
  label: string
  short: string
  armorMalus: BodyPart[]
  calc: (SPECIAL: SpecialValues) => number
}
