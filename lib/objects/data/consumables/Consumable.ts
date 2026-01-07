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

  static dbToData = (payload: Partial<DbConsumableData>): Partial<ConsumableData> => {
    const result = {
      ...payload,
      tags: payload.tags ? (Object.keys(payload.tags ?? {}) as ConsumableType[]) : undefined,
      knowledges: payload.knowledges
        ? (Object.keys(payload.knowledges ?? {}) as KnowledgeId[])
        : undefined,
      modifiers: payload.modifiers ? Object.values(payload.modifiers ?? {}) : undefined
    }
    if (result.knowledges === undefined) delete result.knowledges
    if (result.tags === undefined) delete result.tags
    if (result.modifiers === undefined) delete result.modifiers
    return result
  }

  constructor(
    payload: DbConsumable & { key: string },
    allClothings: Record<string, ConsumableData>
  ) {
    this.id = payload.id
    this.dbKey = payload.key
    this.category = payload.category
    this.isEquipped = payload.isEquipped
    this.data = { ...allClothings[this.id], ...Consumable.dbToData(payload.data ?? {}) }
    this.remainingUse = payload.remainingUse ?? null
  }
}
