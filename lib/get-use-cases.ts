import { QueryClient } from "@tanstack/react-query"

import { DbPlayable } from "./character/Playable"
import getAbilitiesUseCases from "./character/abilities/abilities-use-cases"
import updateCombatStatus, {
  UpdateCombatStatusParams
} from "./character/combat-status/use-cases/update-combat-status"
import addAdditionalEffect from "./character/effects/add-additional-effect"
import { DbEffectData } from "./character/effects/effects.types"
import subAdditionalEffects from "./character/effects/sub-additional-effects"
import addEffect, { AddEffectParams } from "./character/effects/use-cases/add-effect"
import removeEffect, { RemoveEffectParams } from "./character/effects/use-cases/remove-effect"
import updateHp, { UpdateHpParams } from "./character/health/use-cases/update-hp"
import updateLimbsHp, { UpdateLimbsHpParams } from "./character/health/use-cases/update-limbs-hp"
import updateExp, { UpdateExpParams } from "./character/progress/use-cases/update-exp"
import subCharacter from "./character/use-cases/sub-character"
import subCharacterChild, {
  SubCharacterChildParams
} from "./character/use-cases/sub-character-child"
import subCharacters from "./character/use-cases/sub-characters"
import adminEndFight, { AdminEndFightParams } from "./combat/use-cases/admin-end-fight"
import applyDamageEntries, {
  ApplyDamageEntriesParams
} from "./combat/use-cases/apply-damage-entries"
import createFight, { CreateFightParams } from "./combat/use-cases/create-fight"
import deleteFight, { DeleteFightParams } from "./combat/use-cases/delete-fight"
import doCombatAction, { CombatActionParams } from "./combat/use-cases/do-combat-action"
import endWait, { EndWaitParams } from "./combat/use-cases/end-wait"
import prepareAction, { PrepareActionParams } from "./combat/use-cases/prepare-action"
import resetDifficulty, { ResetDifficultyParams } from "./combat/use-cases/reset-difficulty"
import saveAction, { SaveActionParams } from "./combat/use-cases/save-action"
import setDifficulty, { SetDifficultyParams } from "./combat/use-cases/set-difficulty"
import startFight, { StartFightParams } from "./combat/use-cases/start-fight"
import updateAction, { UpdateActionParams } from "./combat/use-cases/update-action"
import waitAction, { WaitActionParams } from "./combat/use-cases/wait-action"
import toggleEquip, { ToggleEquipParams } from "./inventory/use-cases/toggle-equip"
import createNpc, { CreateNpcParams } from "./npc/use-cases/create-npc"
import deleteNpc, { DeleteNpcParams } from "./npc/use-cases/delete-npc"
import { CreatedElements, defaultCreatedElements } from "./objects/created-elements"
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
import getInventoryUseCases from "./objects/inventory-use-cases"
import {
  AdditionalClothingsParams,
  AdditionalConsumablesParams,
  AdditionalEffectsParams,
  AdditionalMiscParams,
  PlayableParams
} from "./shared/db/api-rtdb"
import { DbType } from "./shared/db/db.types"
import updateDate, { UpdateDateParams } from "./squad/use-cases/update-date"

type GetUseCasesParams = {
  db?: DbType
  createdElements?: CreatedElements
  store: QueryClient
}

export type UseCaseConfig = Required<GetUseCasesParams>

export default function getUseCases(payload: GetUseCasesParams) {
  const config = {
    db: payload.db ?? "rtdb",
    createdElements: payload.createdElements ?? defaultCreatedElements,
    store: payload.store
  }

  return {
    inventory: getInventoryUseCases(config),
    weapons: getWeaponsUseCases(config),
    abilities: getAbilitiesUseCases(config),
    additional: {
      subAdditionalClothings: (params: AdditionalClothingsParams = {}) =>
        subAdditionalClothings(config)(params),
      subAdditionalConsumables: (params: AdditionalConsumablesParams = {}) =>
        subAdditionalConsumables(config)(params),
      subAdditionalMisc: (params: AdditionalMiscParams = {}) => subAdditionalMisc(config)(params),
      subAdditionalEffects: (params: AdditionalEffectsParams = {}) =>
        subAdditionalEffects(config)(params),

      addClothing: (data: DbClothingData) => addAdditionalClothing(config)(data),
      addConsumable: (data: DbConsumableData) => addAdditionalConsumable(config)(data),
      addMiscObject: (data: DbMiscObjectData) => addAdditionalMisc(config)(data),
      addEffect: (data: DbEffectData) => addAdditionalEffect(config)(data)
    },
    combat: {
      startFight: (data: StartFightParams) => startFight(config)(data),
      adminEndFight: (data: AdminEndFightParams) => adminEndFight(config)(data),
      create: (data: CreateFightParams) => createFight(config)(data),
      delete: (data: DeleteFightParams) => deleteFight(config)(data),
      // ACTIONS
      doCombatAction: (data: CombatActionParams) => doCombatAction(config)(data),
      waitAction: (data: WaitActionParams) => waitAction(config)(data),
      endWait: (data: EndWaitParams) => endWait(config)(data),
      prepareAction: (data: PrepareActionParams) => prepareAction(config)(data),
      // ACTION HELPERS
      updateAction: (data: UpdateActionParams) => updateAction(config)(data),
      saveAction: (data: SaveActionParams) => saveAction(config)(data),
      setDifficulty: (data: SetDifficultyParams) => setDifficulty(config)(data),
      resetDifficulty: (data: ResetDifficultyParams) => resetDifficulty(config)(data),
      // GM
      applyDamageEntries: (data: ApplyDamageEntriesParams) => applyDamageEntries(config)(data)
    },
    npc: {
      create: (data: CreateNpcParams) => createNpc(config)(data),
      delete: (params: DeleteNpcParams) => deleteNpc(config)(params)
    },
    character: {
      subCharacters: (ids: string[]) => subCharacters(config)(ids),
      sub: (params: PlayableParams) => subCharacter(config)(params),
      subChild: <T extends keyof DbPlayable>(params: SubCharacterChildParams<T>) =>
        subCharacterChild(config)(params),
      updateCombatStatus: (params: UpdateCombatStatusParams) => updateCombatStatus(config)(params),
      updateExp: (params: UpdateExpParams) => updateExp(config)(params),
      addEffect: (params: AddEffectParams) => addEffect(config)(params),
      removeEffect: (params: RemoveEffectParams) => removeEffect(config)(params),
      updateHp: (params: UpdateHpParams) => updateHp(config)(params),
      updateLimbsHp: (params: UpdateLimbsHpParams) => updateLimbsHp(config)(params),
      toggleEquip: (params: ToggleEquipParams) => toggleEquip(config)(params)
    },
    gm: {
      updateDatetime: (params: UpdateDateParams) => updateDate(config)(params)
    }
  }
}
