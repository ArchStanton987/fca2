import { DbEffectData, EffectData, EffectId } from "./effects.types"

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
}
