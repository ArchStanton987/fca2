import fbEffectsRepository from "./character/effects/FbEffectsRepository"
import fbStatusRepository from "./character/status/fbStatusRepository"
import fbEquipedObjectsRepository from "./objects/fbEquipedObjectsRepository"
import fbInventoryRepository from "./objects/fbInventoryRepository"
import fbSquadsRepository from "./squad/fbSquadRepository"

export type RepositoryName =
  | "effects"
  | "equipedObjects"
  | "inventory"
  | "status"
  | "squads"
  | "character"

export const getRepository = {
  rtdb: {
    effects: fbEffectsRepository,
    equipedObjects: fbEquipedObjectsRepository,
    inventory: fbInventoryRepository,
    status: fbStatusRepository,
    squads: fbSquadsRepository
  }
}
