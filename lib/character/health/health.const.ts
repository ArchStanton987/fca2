import colors from "styles/colors"

import { EffectId } from "../effects/effects.types"

export type LimbId =
  // humanoid
  | "head"
  | "leftTorso"
  | "rightTorso"
  | "leftArm"
  | "rightArm"
  | "leftLeg"
  | "rightLeg"
  | "groin"
  // small critt
  | "body"
  | "tail"

const torso: LimbId[] = ["leftTorso", "rightTorso"]
const legs: LimbId[] = ["leftLeg", "rightLeg"]
const arms: LimbId[] = ["leftArm", "rightArm"]

export type LimbsTemplateId =
  | "small"
  | "smallTailed"
  | "medium"
  | "mediumTailed"
  | "large"
  | "largeTailed"

export const limbsTemplates: Record<LimbsTemplateId, LimbId[]> = {
  small: ["head", "body"],
  smallTailed: ["head", "body", "tail"],
  medium: ["head", "body", ...arms, ...legs],
  mediumTailed: ["head", "body", ...arms, ...legs, "tail"],
  large: ["head", "groin", ...torso, ...legs, ...arms],
  largeTailed: ["head", "groin", "tail", ...torso, ...arms, ...legs]
}

export const healthStates: Record<string, { id: EffectId; min: number }> = {
  vanished: { id: "vanished", min: -25 },
  dead: { id: "dead", min: -5 },
  woundedUnconscious: { id: "woundedUnconscious", min: 1 },
  woundedExhausted: { id: "woundedExhausted", min: 25 },
  woundedTired: { id: "woundedTired", min: 50 }
}

export const radStates: { id: EffectId; threshold: number; color: string }[] = [
  { id: "radLvl6", threshold: 1000, color: colors.red },
  { id: "radLvl5", threshold: 800, color: colors.red },
  { id: "radLvl4", threshold: 600, color: colors.orange },
  { id: "radLvl3", threshold: 400, color: colors.orange },
  { id: "radLvl2", threshold: 100, color: colors.yellow },
  { id: "radLvl1", threshold: 50, color: colors.yellow }
]
