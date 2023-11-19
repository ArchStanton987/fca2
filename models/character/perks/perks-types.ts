import { SymptomContainer } from "../effects/symptom"

export type PerkId = "concentration" | "falconEye" | "physEducation" | "moreCrits"

export type Perk = SymptomContainer & {
  id: PerkId
  label: string
  description: string
  availabilityLevel: number
  levelCount: number
}
