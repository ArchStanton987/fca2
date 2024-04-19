import { DbEquipableObject, EquipableCategory, EquipableObject } from "lib/EquipedObjectsRepository"
import { getRepository } from "lib/RepositoryBuilder"
import clothingsMap from "lib/objects/data/clothings/clothings"
import { Clothing, ClothingId } from "lib/objects/data/clothings/clothings.types"
import { Weapon } from "lib/objects/data/weapons/weapons.types"

const getObjectCategory = (object: EquipableObject): EquipableCategory => {
  const isCloth = clothingsMap[object.id as ClothingId] !== undefined
  return isCloth ? ("clothings" as const) : ("weapons" as const)
}

const equipedObjectsController = (db: keyof typeof getRepository = "rtdb") => {
  const repository = getRepository[db].equipedObjects

  return {
    get: (charId: string, category: string, dbKey: string) =>
      repository.get(charId, category, dbKey),

    getByCategory: (charId: string, category: string) => repository.getByCategory(charId, category),

    getAll: (charId: string) => repository.getAll(charId),

    toggle: async (charId: string, object: Weapon | Clothing) => {
      const category = getObjectCategory(object)
      const { dbKey } = object
      if (!object.isEquiped) {
        const payload = { id: object.id } as DbEquipableObject
        return repository.add(charId, category, dbKey, payload)
      }
      return repository.remove(charId, category, dbKey)
    }
  }
}

export default equipedObjectsController
