import getEffectsUseCases from "lib/character/effects/effects-use-cases"
import getStatusUseCases from "lib/character/status/status-use-cases"
import getEquipedObjectsUseCases from "lib/objects/equiped-objects-use-cases"
import getInventoryUseCases from "lib/objects/inventory-yse-cases"

export const useCharEffects = getEffectsUseCases()
export const useEquipedObjects = getEquipedObjectsUseCases()
export const useInventory = getInventoryUseCases()
export const useStatus = getStatusUseCases()
