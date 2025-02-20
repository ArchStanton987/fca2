import { ClothingData, ClothingId, DbClothingData } from "./clothings.types"

export const defaultClothingData = {
  id: null,
  label: null,
  type: "light",
  armorClass: 0,
  threshold: 0,
  physicalDamageResist: 0,
  laserDamageResist: 0,
  plasmaDamageResist: 0,
  fireDamageResist: 0,
  protects: [],
  malus: 0,
  place: 0,
  weight: 0,
  value: 0,
  symptoms: []
}

export default class ClothingsMappers {
  static toDomain(payload: DbClothingData): ClothingData {
    return {
      ...defaultClothingData,
      id: payload.id as ClothingId,
      label: payload.label,
      type: payload.type,
      armorClass: payload.armorClass,
      threshold: payload.threshold,
      physicalDamageResist: payload.physicalDamageResist,
      laserDamageResist: payload.laserDamageResist,
      plasmaDamageResist: payload.plasmaDamageResist,
      fireDamageResist: payload.fireDamageResist,
      protects: Object.values(payload.protects),
      malus: payload.malus,
      place: payload.place,
      weight: payload.weight,
      value: payload.value,
      symptoms: Object.values(payload.symptoms)
    }
  }
}
