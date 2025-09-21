import { BodyPart } from "lib/character/health/health-types"

import { DbClothing, ItemInterface } from "../objects.types"
import { ClothingData, DbClothingData } from "./clothings.types"

export default class Clothing implements ItemInterface {
  id: string
  dbKey: string
  category: "clothings"
  isEquipped: boolean
  data: ClothingData

  static dbToData = (payload: Partial<DbClothingData>): Partial<ClothingData> => ({
    ...payload,
    protects: Object.keys(payload.protects ?? {}) as BodyPart[],
    symptoms: Object.values(payload.symptoms ?? {})
  })

  constructor(payload: DbClothing, allClothings: Record<string, ClothingData>) {
    this.id = payload.id
    this.dbKey = payload.dbKey
    this.category = payload.category
    this.isEquipped = payload.isEquipped
    this.data = { ...allClothings[this.id], ...Clothing.dbToData(payload.data ?? {}) }
  }
}
