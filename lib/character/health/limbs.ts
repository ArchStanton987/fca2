import { EffectId } from "../effects/effects.types"

export type LimbId =
  // human
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

export interface LimbData {
  id: LimbId
  // hp: number
  maxHp: number
  label: string
  // short: string
  cripledEffectId: EffectId
  aim: {
    aimMalus: number
    critBonus: number
  }
}
