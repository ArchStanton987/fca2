import { DbMiscObjectData, MiscObjectData, MiscObjectId } from "./misc-objects-types"

export default class MiscObjectsMappers {
  static toDomain(payload: DbMiscObjectData): MiscObjectData {
    return {
      id: payload.id as MiscObjectId,
      label: payload.label,
      description: payload.description,
      value: payload.value,
      place: payload.place,
      weight: payload.weight,
      symptoms: Object.values(payload.symptoms)
    }
  }
}
