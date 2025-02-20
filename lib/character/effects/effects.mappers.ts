import { DbEffectData, EffectData, EffectId } from "./effects.types"

export const defaultEffectData = {
  id: null,
  type: "drug",
  label: null,
  symptoms: [],
  length: null,
  description: "",
  od: null,
  nextEffectId: null
}

export default class EffectsMappers {
  static toDomain(payload: DbEffectData): EffectData {
    return {
      ...defaultEffectData,
      id: payload.id as EffectId,
      type: payload.type,
      label: payload.label,
      symptoms: Object.values(payload.symptoms ?? {}),
      length: payload.length,
      description: payload.description,
      od: payload.od,
      nextEffectId: payload.nextEffectId as EffectId | null
    }
  }
}
