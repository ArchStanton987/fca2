import { Symptom } from "models/character/effects/symptom"
import { BodyPart } from "models/character/health/health-types"

export type ClothingType = "light" | "medium" | "heavy" | "carry"

export type Clothing = {
  id: ClothingId
  label: string
  type: ClothingType
  armorClass: number
  threshold: number
  physicalDamageResist: number
  laserDamageResist: number
  plasmaDamageResist: number
  fireDamageResist: number
  protects: BodyPart[]
  malus: number
  place: number
  weight: number
  value: number
  symptoms: Symptom[]
}

export type ClothingId =
  | "militaryBelt"
  | "holster"
  | "purse"
  | "backpack"
  | "militaryBackpack"
  | "prewarHat"
  | "prewarSuit"
  | "cowboyHat"
  | "desperadoHat"
  | "leatherJacket"
  | "geckoHide"
  | "combatJacket"
  | "leatherArmor"
  | "raiderLightArmor"
  | "leatherArmorII"
  | "raiderLightArmorII"
  | "bioArmor"
  | "mutieArmor"
  | "helmet"
  | "raiderHelmet"
  | "leatherLegArmor"
  | "leatherArmArmor"
  | "metalArmor"
  | "metalArmorII"
  | "combatArmor"
  | "combatArmorII"
  | "teslaArmor"
  | "mutieArmorII"
  | "mkI"
  | "mkII"
  | "mkc"
  | "mkcI"
  | "mkaI"
  | "mkaII"
