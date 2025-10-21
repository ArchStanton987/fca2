import { getRemainingTime } from "lib/common/utils/time-calc"

import Abilities from "../abilities/Abilities"
import effectsMap from "./effects"
import { DbEffect, EffectData, EffectId, EffectType } from "./effects.types"

export default class Effect {
  id: EffectId
  data: EffectData
  type: EffectType
  dbKey?: string
  startTs?: Date
  endTs?: Date
  timeRemaining?: string | null

  static getEffectLengthInMs = (traits: Abilities["traits"], effect: EffectData) => {
    const isChemReliant = Object.values(traits ?? {}).some(t => t === "chemReliant")
    if (typeof effect?.length !== "number") return null
    const isWithdrawal = effect.type === "withdrawal"
    const lengthInH = isWithdrawal && isChemReliant ? effect.length * 0.5 : effect.length
    return lengthInH * 60 * 60 * 1000
  }

  constructor(
    payload: DbEffect & { key?: string },
    allEffects: Record<string, EffectData> = effectsMap,
    currDate?: Date
  ) {
    this.id = payload.id
    this.dbKey = payload.key
    this.data = allEffects[payload.id]
    this.type = allEffects[payload.id].type

    let timeRemaining = null
    const { length } = allEffects[payload.id]
    if (currDate && payload.endTs) {
      timeRemaining = getRemainingTime(currDate.getTime(), payload.endTs)
      this.endTs = new Date(payload.endTs)
    }
    if (currDate && payload.startTs && length) {
      const lengthInMs = length * 3600000
      const end = new Date(payload.startTs).getTime() + lengthInMs
      this.startTs = new Date(payload.startTs)
      timeRemaining = getRemainingTime(currDate.getTime(), end)
    }
    this.timeRemaining = timeRemaining
  }
}
