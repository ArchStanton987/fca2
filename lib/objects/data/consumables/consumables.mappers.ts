import { ConsumableData, ConsumableId, DbConsumableData } from "./consumables.types"

export default class ConsumablesMapper {
  static toDomain(payload: DbConsumableData): ConsumableData {
    return {
      id: payload.id as ConsumableId,
      label: payload.label,
      effectId: payload.effectId,
      challengeLabel: payload.challengeLabel,
      od: payload.od ?? false,
      addict: payload.addict ?? false,
      value: payload.value,
      place: payload.place,
      weight: payload.weight,
      description: payload.description,
      tags: Object.values(payload.tags),
      maxUsage: payload.maxUsage,
      knowledges: Object.values(payload.knowledges ?? {}),
      skillId: payload.skillId ?? undefined,
      modifiers: Object.values(payload.modifiers ?? {})
    }
  }
}
