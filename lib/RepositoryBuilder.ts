import fbAbilitiesRepository from "lib/character/abilities/fbAbilitiesRepository"

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
  | "abilities"

export const getRepository = {
  rtdb: {
    effects: fbEffectsRepository,
    equipedObjects: fbEquipedObjectsRepository,
    inventory: fbInventoryRepository,
    status: fbStatusRepository,
    abilities: fbAbilitiesRepository,
    squads: fbSquadsRepository
  }
}
