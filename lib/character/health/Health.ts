import { Special } from "../abilities/special/special.types"
import Effect from "../effects/Effect"
import { EffectId } from "../effects/effects.types"
import { getMaxHP } from "./health-calc"
import { healthStates, radStates } from "./health.const"

type LimbId =
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

type LimbsHp = Partial<Record<LimbId, number>>

export interface DbHealth {
  currHp: number
  limbs: LimbsHp
  rads: number
}

type LimbData = {
  id: LimbId
  crippledEffectId: EffectId
  label: string
  short: string
  maxValue: number
  isVital: boolean
}

const limbsMap: Record<LimbId, LimbData> = {
  head: {
    id: "head",
    crippledEffectId: "crippledHead",
    label: "PV tête",
    short: "PVtê",
    maxValue: 15,
    isVital: true
  },
  leftTorso: {
    id: "leftTorso",
    crippledEffectId: "crippledLeftTorso",
    label: "PV torse gauche",
    short: "PVto",
    maxValue: 25,
    isVital: true
  },
  rightTorso: {
    id: "rightTorso",
    crippledEffectId: "crippledRightTorso",
    label: "PV torse droit",
    short: "PVto",
    maxValue: 30,
    isVital: true
  },
  leftArm: {
    id: "leftArm",
    crippledEffectId: "crippledLeftArm",
    label: "PV bras gauche",
    short: "PVBrG",
    maxValue: 20,
    isVital: false
  },
  rightArm: {
    id: "rightArm",
    crippledEffectId: "crippledRightArm",
    label: "PV bras droit",
    short: "PVBrD",
    maxValue: 20,
    isVital: false
  },
  leftLeg: {
    id: "leftLeg",
    crippledEffectId: "crippledLeftLeg",
    label: "PV jambe gauche",
    short: "PVJaG",
    maxValue: 20,
    isVital: false
  },
  rightLeg: {
    id: "rightLeg",
    crippledEffectId: "crippledRightLeg",
    label: "PV jambe droite",
    short: "PVJaD",
    maxValue: 20,
    isVital: false
  },
  groin: {
    id: "groin",
    crippledEffectId: "crippledGroin",
    label: "PV entrejambe",
    short: "PVEnJ",
    maxValue: 15,
    isVital: false
  },
  body: {
    id: "body",
    crippledEffectId: "crippledBody",
    label: "Corps",
    short: "Corps",
    maxValue: 30,
    isVital: true
  },
  tail: {
    id: "tail",
    crippledEffectId: "crippledTail",
    label: "Queue",
    short: "Queue",
    maxValue: 20,
    isVital: false
  }
}

export default class Health {
  maxHp: number
  currHp: number
  limbs: LimbsHp
  rads: number

  constructor(health: DbHealth, baseSPECIAL: Special, exp: number) {
    this.maxHp = getMaxHP(baseSPECIAL, exp)
    this.currHp = health.currHp
    this.limbs = health.limbs
    this.rads = health.rads
  }

  get hpEffects() {
    const result: Partial<Record<EffectId, Effect>> = {}
    const { currHp, maxHp } = this
    const currHpPercent = (currHp / maxHp) * 100
    const healthState = Object.values(healthStates).find(el => currHpPercent < el.min)
    if (healthState) {
      result[healthState.id] = new Effect({ id: healthState.id })
    }
    return result
  }

  get crippledEffects() {
    const { limbs } = this
    return Object.entries(limbs).reduce((acc, [id, hp]) => {
      const hasHp = hp === 0
      if (hasHp) return acc
      const effectId = limbsMap[id as LimbId].crippledEffectId
      const data = new Effect({ id: effectId })
      return { ...acc, [effectId]: data }
    }, {} as Partial<Record<EffectId, Effect>>)
  }

  get radsEffects() {
    const result: Partial<Record<EffectId, Effect>> = {}
    const { rads } = this
    const radsState = radStates.find(el => rads > el.threshold)
    if (radsState) {
      result[radsState.id] = new Effect({ id: radsState.id })
    }
    return result
  }

  get calculatedEffects() {
    return { ...this.hpEffects, ...this.crippledEffects, ...this.radsEffects }
  }
}
