import { ClothingData, ClothingId, DbClothingData } from "./clothings.types"

export default class ClothingsMappers {
  static toDomain(payload: DbClothingData): ClothingData {
    return {
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
