import { EquipableCategory, EquipableObject } from "lib/EquipedObjectsRepository"
import { getRepository } from "lib/RepositoryBuilder"
import Character from "lib/character/Character"
import clothingsMap from "lib/objects/data/clothings/clothings"
import { Clothing, ClothingId } from "lib/objects/data/clothings/clothings.types"
import { Weapon } from "lib/objects/data/weapons/weapons.types"

const getObjectCategory = (object: EquipableObject): EquipableCategory => {
  const isCloth = clothingsMap[object.id as ClothingId] !== undefined
  return isCloth ? ("clothings" as const) : ("weapons" as const)
}

const controller = (db: keyof typeof getRepository = "rtdb") => {
  const repository = getRepository[db].equipedObjects

  return {
    get: (charId: string, category: string, dbKey: string) =>
      repository.get(charId, category, dbKey),

    getByCategory: (charId: string, category: string) => repository.getByCategory(charId, category),

    getAll: (charId: string) => repository.getAll(charId),

    toggle: async (char: Character, object: Weapon | Clothing) => {
      const category = getObjectCategory(object)
      const dbKey = object.id
      if (!object.isEquiped) {
        // TODO: fix TS issue
        return repository.add(char.charId, category, dbKey, { id: object.id })
      }
      return repository.remove(char.charId, category, dbKey)
    }
  }
}

const equipedObjectsController = controller()
export default equipedObjectsController
