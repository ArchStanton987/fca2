import { getRepository } from "./RepositoryBuilder"
import clothingsMap from "./objects/data/clothings/clothings"
import { Clothing, ClothingId } from "./objects/data/clothings/clothings.types"
import consumablesMap from "./objects/data/consumables/consumables"
import { Consumable, ConsumableId } from "./objects/data/consumables/consumables.types"
import miscObjectsMap from "./objects/data/misc-objects/misc-objects"
import { MiscObject, MiscObjectId } from "./objects/data/misc-objects/misc-objects-types"
import weaponsMap from "./objects/data/weapons/weapons"
import { Weapon, WeaponId } from "./objects/data/weapons/weapons.types"
import { ExchangeState } from "./objects/objects-reducer"

const getObjectCategory = (object: Weapon | Clothing | Consumable | MiscObject) => {
  if (weaponsMap[object.id as WeaponId] !== undefined) return "weapons"
  if (clothingsMap[object.id as ClothingId] !== undefined) return "clothings"
  if (consumablesMap[object.id as ConsumableId] !== undefined) return "consumables"
  // TODO: do match db name (objects -> miscObjects)
  if (miscObjectsMap[object.id as MiscObjectId] !== undefined) return "miscObjects"
  throw new Error("Object category not found")
}

const inventoryController = (db: keyof typeof getRepository = "rtdb") => {
  const repository = getRepository[db].inventory
  const equipedObjectsRepository = getRepository[db].equipedObjects

  return {
    getAll: (charId: string) => repository.getAll(charId),
    groupAdd: (charId: string, payload: ExchangeState) => repository.groupAdd(charId, payload),
    remove: (charId: string, object: Weapon | Clothing | Consumable | MiscObject) => {
      const promises = []
      const category = getObjectCategory(object)
      if ("isEquiped" in object && object.isEquiped) {
        promises.push(equipedObjectsRepository.remove(charId, category, object.dbKey))
      }
      promises.push(repository.remove(charId, category, object))
      return Promise.all(promises)
    }
  }
}

export default inventoryController
