import { Symptom } from "../effects/effect-types"

export type PerkId = "concentration" | "falconEye" | "physEducation" | "moreCrits"

export type Perk = {
  id: PerkId
  label: string
  description: string
  availabilityLevel: number
  levelCount: number
  symptoms: Symptom[]
}
