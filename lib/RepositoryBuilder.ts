import fbEffectsRepository from "lib/FbEffectsRepository"
import equipedObjectsRepository from "lib/fbEquipedObjectsRepository"
import fbInventoryRepository from "lib/fbInventoryRepository"
import fbStatusRepository from "lib/fbStatusRepository"

export type RepositoryName = "effects" | "inventory" | "status"

export const getRepository = {
  rtdb: {
    effects: fbEffectsRepository,
    equipedObjects: equipedObjectsRepository,
    inventory: fbInventoryRepository,
    status: fbStatusRepository
  }
}
