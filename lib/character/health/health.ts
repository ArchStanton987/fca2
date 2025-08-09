import { EffectId } from "lib/character/effects/effects.types"

import colors from "styles/colors"

import { HealthStatusId, HealthType } from "./health-types"

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

export type LimbHpId =
  | "headHp"
  | "leftArmHp"
  | "rightArmHp"
  | "leftTorsoHp"
  | "rightTorsoHp"
  | "groinHp"
  | "leftLegHp"
  | "rightLegHp"

export type Limb = {
  id: LimbHpId
  cripledEffect: EffectId
  label: string
  maxValue: number
  minValue: number | false
  aimMalus: number
}

export const limbsMap: Record<LimbHpId, Limb> = {
  headHp: {
    id: "headHp",
    cripledEffect: "cripledHead",
    label: "Tête",
    maxValue: 15,
    minValue: false,
    aimMalus: 30
  },
  leftArmHp: {
    id: "leftArmHp",
    cripledEffect: "cripledLeftArm",
    label: "Bras gauche",
    maxValue: 20,
    minValue: false,
    aimMalus: 10
  },
  rightArmHp: {
    id: "rightArmHp",
    cripledEffect: "cripledRightArm",
    label: "Bras droit",
    maxValue: 20,
    minValue: false,
    aimMalus: 10
  },
  leftTorsoHp: {
    id: "leftTorsoHp",
    cripledEffect: "cripledLeftTorso",
    label: "Torse gauche",
    maxValue: 25,
    minValue: false,
    aimMalus: 0
  },
  rightTorsoHp: {
    id: "rightTorsoHp",
    cripledEffect: "cripledRightTorso",
    label: "Torse droit",
    maxValue: 30,
    minValue: false,
    aimMalus: 0
  },
  groinHp: {
    id: "groinHp",
    cripledEffect: "cripledGroin",
    label: "Entrejambe",
    maxValue: 15,
    minValue: false,
    aimMalus: 30
  },
  leftLegHp: {
    id: "leftLegHp",
    cripledEffect: "cripledLeftLeg",
    label: "Jambe gauche",
    maxValue: 20,
    minValue: false,
    aimMalus: 10
  },
  rightLegHp: {
    id: "rightLegHp",
    cripledEffect: "cripledRightLeg",
    label: "Jambe droite",
    maxValue: 20,
    minValue: false,
    aimMalus: 10
  }
}

export const limbsDefault = Object.values(limbsMap).reduce((acc, curr) => {
  acc[curr.id] = curr.maxValue
  return acc
}, {} as Record<LimbHpId, number>)

const healthMap: Record<HealthStatusId, HealthType> = {
  headHp: {
    id: "headHp",
    label: "PV tête",
    short: "PVtê",
    minValue: 0,
    maxValue: 15
  },
  leftTorsoHp: {
    id: "leftTorsoHp",
    label: "PV torse gauche",
    short: "PVto",
    minValue: 0,
    maxValue: 25
  },
  rightTorsoHp: {
    id: "rightTorsoHp",
    label: "PV torse droit",
    short: "PVto",
    minValue: 0,
    maxValue: 30
  },
  leftArmHp: {
    id: "leftArmHp",
    label: "PV bras gauche",
    short: "PVBrG",
    minValue: 0,
    maxValue: 20
  },
  rightArmHp: {
    id: "rightArmHp",
    label: "PV bras droit",
    short: "PVBrD",
    minValue: 0,
    maxValue: 20
  },
  leftLegHp: {
    id: "leftLegHp",
    label: "PV jambe gauche",
    short: "PVJaG",
    minValue: 0,
    maxValue: 20
  },
  rightLegHp: {
    id: "rightLegHp",
    label: "PV jambe droite",
    short: "PVJaD",
    minValue: 0,
    maxValue: 20
  },
  groinHp: {
    id: "groinHp",
    label: "PV entrejambe",
    short: "PVEnJ",
    minValue: 0,
    maxValue: 15
  },
  rads: {
    id: "rads",
    label: "Rads",
    short: "Rad",
    minValue: 0,
    maxValue: 1000
  }
}

export default healthMap
