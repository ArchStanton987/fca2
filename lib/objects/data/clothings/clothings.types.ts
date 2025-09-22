import { DbSymptoms, Symptom } from "../../../character/effects/symptoms.type"

export type BodyPart = "head" | "torso" | "arms" | "groin" | "legs"
export type DbBodyParts = Record<BodyPart, BodyPart>

export type ClothingType = "light" | "medium" | "heavy" | "carry"

export type ClothingData = {
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
  tier: number
  symptoms: Symptom[]
}

export type DbClothingData = {
  id: ClothingId
  label: string
  type: ClothingType
  armorClass: number
  threshold: number
  physicalDamageResist: number
  laserDamageResist: number
  plasmaDamageResist: number
  fireDamageResist: number
  protects: DbBodyParts
  malus: number
  place: number
  weight: number
  value: number
  tier: number
  symptoms: DbSymptoms
}

// export type Clothing = {
//   id: ClothingId
//   dbKey: string
//   category: "clothing"
//   isEquiped: boolean
//   data: ClothingData
// }

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
