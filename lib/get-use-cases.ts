import { DbChar } from "./character/Character"
import getAbilitiesUseCases from "./character/abilities/abilities-use-cases"
import addAdditionalEffect from "./character/effects/add-additional-effect"
import getEffectsUseCases from "./character/effects/effects-use-cases"
import { DbEffectData } from "./character/effects/effects.types"
import subAdditionalEffects from "./character/effects/sub-additional-effects"
import getStatusUseCases from "./character/status/status-use-cases"
import subCharacter from "./character/use-cases/sub-character"
import subCharacterChild, {
  SubCharacterChildParams
} from "./character/use-cases/sub-character-child"
import subCharacters from "./character/use-cases/sub-characters"
import createFight, { CreateFightParams } from "./combat/use-cases/create-fight"
import subFight, { SubFightParams } from "./combat/use-cases/sub-fight"
import updateContender, { UpdateContenderParams } from "./combat/use-cases/update-contender"
import updateFight, { UpdateFightParams } from "./combat/use-cases/update-fight"
import waitAction, { WaitActionParams } from "./combat/use-cases/wait-action"
import createEnemy, { CreateEnemyParams } from "./enemy/use-cases/create-enemy"
import subAllEnemies from "./enemy/use-cases/sub-all-enemies"
import subEnemies from "./enemy/use-cases/sub-enemies"
import subEnemy from "./enemy/use-cases/sub-enemy"
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
import {
  AdditionalClothingsParams,
  AdditionalConsumablesParams,
  AdditionalEffectsParams,
  AdditionalMiscParams,
  CharacterParams
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
    },
    combat: {
      sub: (data: SubFightParams) => subFight(dbType)(data),
      create: (data: CreateFightParams) => createFight(dbType)(data),
      update: (data: UpdateFightParams) => updateFight(dbType)(data),
      updateContender: (data: UpdateContenderParams) => updateContender(dbType)(data),
      waitAction: (data: WaitActionParams) => waitAction(dbType)(data)
      // addNewRound: (data: AddRoundParams) => addNewRound(dbType)(data),
      // addAction: (data: AddActionParams) => addAction(dbType)(data)
    },
    enemy: {
      subAll: () => subAllEnemies(dbType)(),
      subEnemies: (ids: string[]) => subEnemies(dbType)(ids),
      sub: (id: string) => subEnemy(dbType)(id),
      create: (data: CreateEnemyParams) => createEnemy(dbType)(data)
    },
    character: {
      subCharacters: (ids: string[]) => subCharacters(dbType)(ids),
      sub: (params: CharacterParams) => subCharacter(dbType)(params),
      subChild: <T extends keyof DbChar>(params: SubCharacterChildParams<T>) =>
        subCharacterChild(dbType)(params)
    }
  }
}
