import { DbClothing, ItemInterface } from "../objects.types"
import { BodyPart } from "./armor.types"
import { ClothingData, DbClothingData } from "./clothings.types"

export default class Clothing implements ItemInterface {
  id: string
  dbKey: string
  category: "clothings"
  isEquipped: boolean
  data: ClothingData

  static dbToData = (payload: Partial<DbClothingData>): Partial<ClothingData> => {
    const result = {
      ...payload,
      protects: payload.protects ? (Object.keys(payload.protects ?? {}) as BodyPart[]) : undefined,
      symptoms: payload.symptoms ? Object.values(payload.symptoms ?? {}) : undefined
    }
    if (result.protects === undefined) delete result.protects
    if (result.symptoms === undefined) delete result.symptoms
    return result
  }

  constructor(payload: DbClothing & { key: string }, allClothings: Record<string, ClothingData>) {
    this.id = payload.id
    this.dbKey = payload.key
    this.category = payload.category
    this.isEquipped = payload.isEquipped
    this.data = { ...allClothings[this.id], ...Clothing.dbToData(payload.data ?? {}) }
  }
}
