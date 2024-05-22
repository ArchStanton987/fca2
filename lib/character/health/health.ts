import { EffectId } from "lib/character/effects/effects.types"

import { HealthStatusId, HealthType } from "./health-types"

// TODO: fix ts
export const healthStates: Record<EffectId, { id: EffectId; min: number }> = {
  vanished: { id: "vanished", min: -25 },
  dead: { id: "dead", min: -5 },
  woundedUnconscious: { id: "woundedUnconscious", min: 1 },
  woundedExhausted: { id: "woundedExhausted", min: 25 },
  woundedTired: { id: "woundedTired", min: 50 }
}

export const radStates: { id: EffectId; threshold: number }[] = [
  { id: "radLvl6", threshold: 1000 },
  { id: "radLvl5", threshold: 800 },
  { id: "radLvl4", threshold: 600 },
  { id: "radLvl3", threshold: 400 },
  { id: "radLvl2", threshold: 100 },
  { id: "radLvl1", threshold: 50 }
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
}

export const limbsMap: Record<LimbHpId, Limb> = {
  headHp: {
    id: "headHp",
    cripledEffect: "cripledHead",
    label: "Tête",
    maxValue: 15,
    minValue: false
  },
  leftArmHp: {
    id: "leftArmHp",
    cripledEffect: "cripledLeftArm",
    label: "Bras gauche",
    maxValue: 20,
    minValue: false
  },
  rightArmHp: {
    id: "rightArmHp",
    cripledEffect: "cripledRightArm",
    label: "Bras droit",
    maxValue: 20,
    minValue: false
  },
  leftTorsoHp: {
    id: "leftTorsoHp",
    cripledEffect: "cripledLeftTorso",
    label: "Torse gauche",
    maxValue: 25,
    minValue: false
  },
  rightTorsoHp: {
    id: "rightTorsoHp",
    cripledEffect: "cripledRightTorso",
    label: "Torse droit",
    maxValue: 30,
    minValue: false
  },
  groinHp: {
    id: "groinHp",
    cripledEffect: "cripledGroin",
    label: "Entrejambe",
    maxValue: 15,
    minValue: false
  },
  leftLegHp: {
    id: "leftLegHp",
    cripledEffect: "cripledLeftLeg",
    label: "Jambe gauche",
    maxValue: 20,
    minValue: false
  },
  rightLegHp: {
    id: "rightLegHp",
    cripledEffect: "cripledRightLeg",
    label: "Jambe droite",
    maxValue: 20,
    minValue: false
  }
}

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
  poison: {
    id: "poison",
    label: "Poison",
    short: "Pois",
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
