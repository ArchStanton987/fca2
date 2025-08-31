import Playable from "../Playable"
import effectsMap from "./effects"
import { getEffectLengthInMs } from "./effects-use-cases"
import { DbEffect, DbEffectData, EffectData, EffectId } from "./effects.types"

export default class EffectsMappers {
  static toDomain(payload: DbEffectData): EffectData {
    return {
      id: payload.id as EffectId,
      type: payload.type,
      label: payload.label,
      symptoms: Object.values(payload.symptoms ?? {}),
      length: payload.length,
      description: payload.description,
      nextEffectId: payload.nextEffectId as EffectId | null
    }
  }

  static toDb(
    char: Playable,
    effectId: EffectId,
    startDate?: Date,
    effectLengthInMs?: number,
    withCreatedEffects: Record<EffectId, EffectData> = effectsMap
  ): DbEffect {
    const refStartDate = startDate || char.date
    const dbEffect: DbEffect = { id: effectId, startTs: refStartDate.toJSON() }
    const lengthInMs = effectLengthInMs ?? getEffectLengthInMs(char, withCreatedEffects[effectId])
    if (lengthInMs) {
      dbEffect.endTs = new Date(refStartDate.getTime() + lengthInMs).toJSON()
    }
    return dbEffect
  }
}
