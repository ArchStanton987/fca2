import getAbilitiesUseCases from "lib/character/abilities/abilities-use-cases"
import getEffectsUseCases from "lib/character/effects/effects-use-cases"
import getStatusUseCases from "lib/character/status/status-use-cases"
import getWeaponsUseCases from "lib/objects/data/weapons/weapons-use-cases"
import getEquipedObjectsUseCases from "lib/objects/equiped-objects-use-cases"
import getInventoryUseCases from "lib/objects/inventory-use-cases"
import getSquadUseCases from "lib/squad/squad-use-cases"

const effects = getEffectsUseCases()
const equipedObjects = getEquipedObjectsUseCases()
const inventory = getInventoryUseCases()
const weapons = getWeaponsUseCases()
const status = getStatusUseCases()
const squad = getSquadUseCases()
const abilities = getAbilitiesUseCases()

const useCases = {
  effects,
  equipedObjects,
  inventory,
  weapons,
  status,
  squad,
  abilities
}

export default useCases
