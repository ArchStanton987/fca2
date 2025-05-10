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
import adminEndFight, { AdminEndFightParams } from "./combat/use-cases/admin-end-fight"
import createFight, { CreateFightParams } from "./combat/use-cases/create-fight"
import deleteFight, { DeleteFightParams } from "./combat/use-cases/delete-fight"
import endWait, { EndWaitParams } from "./combat/use-cases/end-wait"
import movementAction, { MovementActionParams } from "./combat/use-cases/movement-action"
import prepareAction, { PrepareActionParams } from "./combat/use-cases/prepare-action"
import saveAction, { SaveActionParams } from "./combat/use-cases/save-action"
import startFight, { StartFightParams } from "./combat/use-cases/start-fight"
import subAllFights from "./combat/use-cases/sub-all-fights"
import subFight, { SubFightParams } from "./combat/use-cases/sub-fight"
import updateAction, { UpdateActionParams } from "./combat/use-cases/update-action"
import updateContender, { UpdateContenderParams } from "./combat/use-cases/update-contender"
import updateFight, { UpdateFightParams } from "./combat/use-cases/update-fight"
import waitAction, { WaitActionParams } from "./combat/use-cases/wait-action"
import createNpc, { CreateNpcParams } from "./npc/use-cases/create-npc"
import deleteNpc, { DeleteNpcParams } from "./npc/use-cases/delete-npc"
import subAllNpcs from "./npc/use-cases/sub-all-npcs"
import subNpc from "./npc/use-cases/sub-npc"
import subNpcs from "./npc/use-cases/sub-npcs"
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
      subAll: () => subAllFights(dbType)(),
      startFight: (data: StartFightParams) => startFight(dbType)(data),
      adminEndFight: (data: AdminEndFightParams) => adminEndFight(dbType)(data),
      create: (data: CreateFightParams) => createFight(dbType)(data),
      update: (data: UpdateFightParams) => updateFight(dbType)(data),
      delete: (data: DeleteFightParams) => deleteFight(dbType)(data),
      updateContender: (data: UpdateContenderParams) => updateContender(dbType)(data),
      // ACTIONS
      waitAction: (data: WaitActionParams) => waitAction(dbType)(data),
      endWait: (data: EndWaitParams) => endWait(dbType)(data),
      prepareAction: (data: PrepareActionParams) => prepareAction(dbType)(data),
      movementAction: (data: MovementActionParams) => movementAction(dbType)(data),
      // ACTION HELPERS
      updateAction: (data: UpdateActionParams) => updateAction(dbType)(data),
      saveAction: (data: SaveActionParams) => saveAction(dbType)(data)
    },
    npc: {
      subAll: () => subAllNpcs(dbType)(),
      subNpcs: (ids: string[]) => subNpcs(dbType)(ids),
      sub: (id: string) => subNpc(dbType)(id),
      create: (data: CreateNpcParams) => createNpc(dbType)(data),
      delete: (params: DeleteNpcParams) => deleteNpc(dbType)(params)
    },
    character: {
      subCharacters: (ids: string[]) => subCharacters(dbType)(ids),
      sub: (params: CharacterParams) => subCharacter(dbType)(params),
      subChild: <T extends keyof DbChar>(params: SubCharacterChildParams<T>) =>
        subCharacterChild(dbType)(params)
    }
    // effects: {
    //   addEffectsToChar: (params: AddEffectsParams) => addEffects(dbType, createdElements)(params)
    // }
  }
}
