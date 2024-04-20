import equipedObjectsRepository from "lib/EquipedObjectsRepository"
import fbEffectsRepository from "lib/FbEffectsRepository"
import fbInventoryRepository from "lib/fbInventoryRepository"

export type RepositoryName = "effects" | "inventory" | "status" | "health"

export const getRepository = {
  rtdb: {
    effects: fbEffectsRepository,
    equipedObjects: equipedObjectsRepository,
    inventory: fbInventoryRepository
  }
}
