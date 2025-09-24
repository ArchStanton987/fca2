import Abilities from "../abilities/Abilities"
import Effect from "./Effect"
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
    traits: Abilities["traits"],
    effectId: EffectId,
    effectData: EffectData,
    startDate: Date,
    effectLengthInMs?: number
  ): DbEffect {
    const dbEffect: DbEffect = { id: effectId, startTs: startDate.toJSON() }
    const lengthInMs = effectLengthInMs ?? Effect.getEffectLengthInMs(traits, effectData)
    if (lengthInMs) {
      dbEffect.endTs = new Date(startDate.getTime() + lengthInMs).toJSON()
    }
    return dbEffect
  }
}
