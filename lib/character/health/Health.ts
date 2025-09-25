import { getRandomArbitrary } from "lib/common/utils/dice-calc"

import Abilities from "../abilities/Abilities"
import { Special } from "../abilities/special/special.types"
import Effect from "../effects/Effect"
import { EffectId } from "../effects/effects.types"
import { getLevelAndThresholds } from "../status/status-calc"
import { healthStates, radStates } from "./health.const"

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
  aim: {
    aimMalus: number
    critBonus: number
  }
}

export const limbsMap: Record<LimbId, LimbData> = {
  head: {
    id: "head",
    crippledEffectId: "crippledHead",
    label: "PV tête",
    short: "PVtê",
    maxValue: 15,
    isVital: true,
    aim: {
      aimMalus: 30,
      critBonus: 30
    }
  },
  leftTorso: {
    id: "leftTorso",
    crippledEffectId: "crippledLeftTorso",
    label: "PV torse gauche",
    short: "PVto",
    maxValue: 25,
    isVital: true,
    aim: {
      aimMalus: 0,
      critBonus: 0
    }
  },
  rightTorso: {
    id: "rightTorso",
    crippledEffectId: "crippledRightTorso",
    label: "PV torse droit",
    short: "PVto",
    maxValue: 30,
    isVital: true,
    aim: {
      aimMalus: 0,
      critBonus: 0
    }
  },
  leftArm: {
    id: "leftArm",
    crippledEffectId: "crippledLeftArm",
    label: "PV bras gauche",
    short: "PVBrG",
    maxValue: 20,
    isVital: false,
    aim: {
      aimMalus: 10,
      critBonus: 10
    }
  },
  rightArm: {
    id: "rightArm",
    crippledEffectId: "crippledRightArm",
    label: "PV bras droit",
    short: "PVBrD",
    maxValue: 20,
    isVital: false,
    aim: {
      aimMalus: 10,
      critBonus: 10
    }
  },
  leftLeg: {
    id: "leftLeg",
    crippledEffectId: "crippledLeftLeg",
    label: "PV jambe gauche",
    short: "PVJaG",
    maxValue: 20,
    isVital: false,
    aim: {
      aimMalus: 10,
      critBonus: 10
    }
  },
  rightLeg: {
    id: "rightLeg",
    crippledEffectId: "crippledRightLeg",
    label: "PV jambe droite",
    short: "PVJaD",
    maxValue: 20,
    isVital: false,
    aim: {
      aimMalus: 10,
      critBonus: 10
    }
  },
  groin: {
    id: "groin",
    crippledEffectId: "crippledGroin",
    label: "PV entrejambe",
    short: "PVEnJ",
    maxValue: 15,
    isVital: false,
    aim: {
      aimMalus: 30,
      critBonus: 30
    }
  },
  body: {
    id: "body",
    crippledEffectId: "crippledBody",
    label: "Corps",
    short: "Corps",
    maxValue: 30,
    isVital: true,
    aim: {
      aimMalus: 10,
      critBonus: 10
    }
  },
  tail: {
    id: "tail",
    crippledEffectId: "crippledTail",
    label: "Queue",
    short: "Queue",
    maxValue: 20,
    isVital: false,
    aim: {
      aimMalus: 10,
      critBonus: 10
    }
  }
}

export default class Health {
  maxHp: number
  currHp: number
  missingHp: number
  limbs: LimbsHp
  rads: number

  static getMaxHp(baseSpecial: Special, exp: number) {
    const baseMaxHP = baseSpecial.endurance * 2 + 15 + baseSpecial.strength
    const gainMaxHPPerLvl = Math.ceil(baseSpecial.endurance / 2) + 3
    const { level } = getLevelAndThresholds(exp)
    const levelGained = level - 1
    const result = levelGained * gainMaxHPPerLvl + baseMaxHP
    return result
  }

  static getHpDiffOnTimePass(currDate: Date, newDate: Date, healPerHour: number) {
    const hoursPassed = (newDate.getTime() - currDate.getTime()) / 3600000
    return Math.round(healPerHour * hoursPassed)
  }

  static getHealthEffectId(currHp: number, maxHp: number) {
    const currHpPercent = (currHp / maxHp) * 100
    const negativeValue = Math.max(currHp, currHpPercent)
    if (negativeValue < healthStates.vanished.min) return healthStates.vanished.id
    if (negativeValue < healthStates.dead.min) return healthStates.dead.id
    if (currHp < 1) return healthStates.woundedUnconscious.id
    if (currHpPercent < healthStates.woundedExhausted.min) return healthStates.woundedExhausted.id
    if (currHpPercent < healthStates.woundedTired.min) return healthStates.woundedTired.id
    return null
  }

  static getRadEffectId(rads: number) {
    return radStates.find(radState => rads > radState.threshold)
  }

  constructor(health: DbHealth, baseSPECIAL: Special, exp: number) {
    this.maxHp = Health.getMaxHp(baseSPECIAL, exp)
    this.currHp = health.currHp
    this.missingHp = this.maxHp - this.currHp
    this.limbs = health.limbs
    this.rads = health.rads
  }

  get hpEffects() {
    const result: Partial<Record<EffectId, Effect>> = {}
    const effectId = Health.getHealthEffectId(this.currHp, this.maxHp)
    if (effectId) {
      const healthEffect = new Effect({ id: effectId })
      result[effectId] = healthEffect
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
    const radsState = Health.getRadEffectId(this.rads)
    if (radsState) {
      result[radsState.id] = new Effect({ id: radsState.id })
    }
    return result
  }

  get calculatedEffects() {
    return { ...this.hpEffects, ...this.crippledEffects, ...this.radsEffects }
  }

  getNewHpOnTimePass(currDate: Date, newDate: Date, secAttr: Abilities["secAttr"]) {
    const { healHpPerHour, poisResist } = secAttr.curr
    const hpDiff = Health.getHpDiffOnTimePass(currDate, newDate, healHpPerHour)
    if (hpDiff === 0) return 0
    const isHealing = hpDiff > 0
    if (isHealing) {
      const healedHp = Math.min(this.missingHp, hpDiff)
      return this.currHp + healedHp
    }

    const rawDamage = Math.abs(hpDiff)
    const poisonDamageMultiplier = 1 - poisResist / 100
    const totalDamage = poisonDamageMultiplier * rawDamage
    return this.currHp - totalDamage
  }

  getNewLimbsOnTimePass(currDate: Date, newDate: Date, secAttr: Abilities["secAttr"]) {
    const { healHpPerHour, poisResist } = secAttr.curr
    const hpDiff = Health.getHpDiffOnTimePass(currDate, newDate, healHpPerHour)

    if (hpDiff === 0) return this.limbs

    const isHealing = hpDiff > 0

    const newLimbsHp = {} as Record<LimbId, number>

    // if hpDiff is positive, character is healing
    if (isHealing) {
      const healedHp = Math.min(this.missingHp, hpDiff)
      for (let i = 0; i < healedHp; i += 1) {
        const healableLimbs = Object.entries(this.limbs).filter(
          ([id, value]) => value < limbsMap[id as LimbId].maxValue
        )
        const randomIndex = getRandomArbitrary(0, healableLimbs.length)
        const limbIdToHeal = healableLimbs[randomIndex][0]
        newLimbsHp[limbIdToHeal as LimbId] += 1
      }
      return newLimbsHp
    }

    // if hpDiff is negative, character is poisoned
    const baseDamageHp = Math.abs(hpDiff)
    const poisonDamageMultiplier = 1 - poisResist / 100
    // damage to be taken with poison resistance
    const rawDamage = poisonDamageMultiplier * baseDamageHp
    for (let i = 0; i < rawDamage; i += 1) {
      const damageableLimbs = Object.entries(this.limbs).filter(([, value]) => value > 0)
      const randomIndex = getRandomArbitrary(0, damageableLimbs.length)
      const limbIdToDamage = damageableLimbs[randomIndex][0]
      newLimbsHp[limbIdToDamage as LimbId] -= 1
    }
    return newLimbsHp
  }
}
