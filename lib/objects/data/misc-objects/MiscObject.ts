import { DbMiscObject, ItemInterface } from "../objects.types"
import { DbMiscObjectData, MiscObjectData } from "./misc-objects-types"

export default class MiscObject implements ItemInterface {
  id: string
  dbKey: string
  category: "misc"
  isEquipped: boolean
  data: MiscObjectData

  static dbToData = (payload: Partial<DbMiscObjectData>): Partial<MiscObjectData> => ({
    ...payload,
    symptoms: Object.values(payload.symptoms ?? {})
  })

  constructor(
    payload: DbMiscObject & { key: string },
    allMiscObjects: Record<string, MiscObjectData>
  ) {
    this.id = payload.id
    this.dbKey = payload.key
    this.category = payload.category
    this.isEquipped = payload.isEquipped
    this.data = { ...allMiscObjects[this.id], ...MiscObject.dbToData(payload.data ?? {}) }
  }
}
