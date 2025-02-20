import { DbMiscObjectData, MiscObjectData, MiscObjectId } from "./misc-objects-types"

export const defaultMiscObjectData = {
  id: null,
  label: null,
  description: "",
  value: 0,
  place: 0,
  weight: 0
}

export default class MiscObjectsMappers {
  static toDomain(payload: DbMiscObjectData): MiscObjectData {
    return {
      ...defaultMiscObjectData,
      id: payload.id as MiscObjectId,
      label: payload.label,
      description: payload.description,
      value: payload.value,
      place: payload.place,
      weight: payload.weight
    }
  }
}
