import getAbilitiesUseCases from "./character/abilities/abilities-use-cases"
import addAdditionalEffect from "./character/effects/add-additional-effect"
import getEffectsUseCases from "./character/effects/effects-use-cases"
import { DbEffectData } from "./character/effects/effects.types"
import subAdditionalEffects from "./character/effects/sub-additional-effects"
import getStatusUseCases from "./character/status/status-use-cases"
import { defaultCreatedElements } from "./objects/created-elements"
import addAdditionalClothing from "./objects/data/clothings/add-additional-clothings"
import { DbClothingData } from "./objects/data/clothings/clothings.types"
import subAdditionalClothings from "./objects/data/clothings/sub-additional-clothings"
import addAdditionalConsumable from "./objects/data/consumables/add-additional-consumable"
import { DbConsumableData } from "./objects/data/consumables/consumables.types"
import subAdditionalConsumables from "./objects/data/consumables/sub-additional-consumables"
import addAdditionalMisc from "./objects/data/misc-objects/add-addictional-misc"
import { DbMiscObjectData } from "./objects/data/misc-objects/misc-objects-types"
import subAdditionalMisc from "./objects/data/misc-objects/sub-additional-misc"
import getWeaponsUseCases from "./objects/data/weapons/weapons-use-cases"
import getEquipedObjectsUseCases from "./objects/equiped-objects-use-cases"
import getInventoryUseCases from "./objects/inventory-use-cases"
import subAdditional from "./objects/sub-additional"
import {
  AdditionalClothingsParams,
  AdditionalConsumablesParams,
  AdditionalEffectsParams,
  AdditionalMiscParams,
  AdditionalParams
} from "./shared/db/api-rtdb"
import { DbType } from "./shared/db/db.types"
import getSquadUseCases from "./squad/squad-use-cases"

export default function getUseCases(
  dbType: DbType = "rtdb",
  createdElements = defaultCreatedElements
) {
  return {
    effects: getEffectsUseCases(dbType, createdElements),
    equipedObjects: getEquipedObjectsUseCases(dbType, createdElements),
    inventory: getInventoryUseCases(dbType, createdElements),
    weapons: getWeaponsUseCases(dbType),
    status: getStatusUseCases(dbType, createdElements),
    squad: getSquadUseCases(dbType),
    abilities: getAbilitiesUseCases(dbType),
    additional: {
      subAdditionalData: (params: AdditionalParams = {}) => subAdditional(dbType)(params),
      subAdditionalClothings: (params: AdditionalClothingsParams = {}) =>
        subAdditionalClothings(dbType)(params),
      subAdditionalConsumables: (params: AdditionalConsumablesParams = {}) =>
        subAdditionalConsumables(dbType)(params),
      subAdditionalMisc: (params: AdditionalMiscParams = {}) => subAdditionalMisc(dbType)(params),
      subAdditionalEffects: (params: AdditionalEffectsParams = {}) =>
        subAdditionalEffects(dbType)(params),

      addClothing: (data: DbClothingData) => addAdditionalClothing(dbType)(data),
      addConsumable: (data: DbConsumableData) => addAdditionalConsumable(dbType)(data),
      addMiscObject: (data: DbMiscObjectData) => addAdditionalMisc(dbType)(data),
      addEffect: (data: DbEffectData) => addAdditionalEffect(dbType)(data)
    }
  }
}
