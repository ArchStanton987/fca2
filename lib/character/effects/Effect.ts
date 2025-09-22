import { getRemainingTime } from "lib/common/utils/time-calc"

import effectsMap from "./effects"
import { DbEffect, EffectData, EffectId } from "./effects.types"

export default class Effect {
  id: EffectId
  data: EffectData
  dbKey?: string
  startTs?: Date
  endTs?: Date
  timeRemaining?: string | null

  constructor(
    payload: DbEffect,
    allEffects: Record<string, EffectData> = effectsMap,
    currDate?: Date
  ) {
    this.id = payload.id
    this.data = allEffects[payload.id]

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
