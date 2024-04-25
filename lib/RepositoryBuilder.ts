import fbEffectsRepository from "lib/FbEffectsRepository"
import fbCharacterRepository from "lib/fbCharacterRepository"
import equipedObjectsRepository from "lib/fbEquipedObjectsRepository"
import fbInventoryRepository from "lib/fbInventoryRepository"
import fbSquadsRepository from "lib/fbSquadRepository"
import fbStatusRepository from "lib/fbStatusRepository"

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
    equipedObjects: equipedObjectsRepository,
    inventory: fbInventoryRepository,
    status: fbStatusRepository,
    squads: fbSquadsRepository,
    character: fbCharacterRepository
  }
}
