import { getRepository } from "lib/RepositoryBuilder"
import clothingsMap from "lib/objects/data/clothings/clothings"
import { Clothing, ClothingId } from "lib/objects/data/clothings/clothings.types"
import { Weapon } from "lib/objects/data/weapons/weapons.types"

import { EquipableCategory, EquipableObject } from "./fbEquipedObjectsRepository"

const getObjectCategory = (object: EquipableObject): EquipableCategory => {
  const isCloth = clothingsMap[object.id as ClothingId] !== undefined
  return isCloth ? ("clothings" as const) : ("weapons" as const)
}

const getEquipedObjectsUseCases = (db: keyof typeof getRepository = "rtdb") => {
  const repository = getRepository[db].equipedObjects

  return {
    get: (charId: string, category: EquipableCategory, dbKey: EquipableObject["dbKey"]) =>
      repository.get(charId, category, dbKey),

    getByCategory: (charId: string, category: EquipableCategory) =>
      repository.getByCategory(charId, category),

    getAll: (charId: string) => repository.getAll(charId),

    toggle: async (charId: string, object: Weapon | Clothing) => {
      const category = getObjectCategory(object)
      const { dbKey } = object
      if (!object.isEquiped) {
        return repository.add(charId, category, object)
      }
      return repository.remove(charId, category, dbKey)
    },

    remove: (charId: string, category: EquipableCategory, dbKey: EquipableObject["dbKey"]) =>
      repository.remove(charId, category, dbKey)
  }
}

export default getEquipedObjectsUseCases
