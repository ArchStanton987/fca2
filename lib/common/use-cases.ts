import getEffectsUseCases from "lib/character/effects/effects-use-cases"
import getStatusUseCases from "lib/character/status/status-use-cases"
import getEquipedObjectsUseCases from "lib/objects/equiped-objects-use-cases"
import getInventoryUseCases from "lib/objects/inventory-yse-cases"

const effects = getEffectsUseCases()
const equipedObjects = getEquipedObjectsUseCases()
const inventory = getInventoryUseCases()
const status = getStatusUseCases()

const useCases = {
  effects,
  equipedObjects,
  inventory,
  status
}

export default useCases