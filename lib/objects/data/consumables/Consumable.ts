import { KnowledgeId } from "lib/character/abilities/knowledges/knowledge-types"

import { DbConsumable, ItemInterface } from "../objects.types"
import { ConsumableData, ConsumableType, DbConsumableData } from "./consumables.types"

export default class Consumable implements ItemInterface {
  id: string
  dbKey: string
  category: "consumables"
  isEquipped: boolean
  data: ConsumableData
  remainingUse: number | null

  static dbToData = (payload: Partial<DbConsumableData>): Partial<ConsumableData> => ({
    ...payload,
    effectId: payload.effectId ?? null,
    challengeLabel: payload.challengeLabel ?? null,
    od: payload.od ?? false,
    addict: payload.addict ?? false,
    tags: Object.keys(payload.tags ?? {}) as ConsumableType[],
    knowledges: Object.keys(payload.knowledges ?? {}) as KnowledgeId[],
    modifiers: Object.values(payload.modifiers ?? {})
  })

  constructor(payload: DbConsumable, allClothings: Record<string, ConsumableData>) {
    this.id = payload.id
    this.dbKey = payload.dbKey
    this.category = payload.category
    this.isEquipped = payload.isEquipped
    this.data = { ...allClothings[this.id], ...Consumable.dbToData(payload.data ?? {}) }
    this.remainingUse = payload.remainingUse ?? null
  }
}
