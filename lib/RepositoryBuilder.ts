import fbEffectsRepository from "./character/effects/FbEffectsRepository"
import fbStatusRepository from "./character/status/fbStatusRepository"
import fbCharacterRepository from "./fbCharacterRepository"
import fbSquadsRepository from "./fbSquadRepository"
import fbEquipedObjectsRepository from "./objects/fbEquipedObjectsRepository"
import fbInventoryRepository from "./objects/fbInventoryRepository"

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
    squads: fbSquadsRepository,
    character: fbCharacterRepository
  }
}
