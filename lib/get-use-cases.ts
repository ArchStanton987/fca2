import updateKnowledges, {
  UpdateKnowledgesParams
} from "./character/abilities/knowledges/use-cases/update-knowledges"
import updateUpSkills, {
  UpdateUpSkillsParams
} from "./character/abilities/skills/use-cases/update-upskills"
import updateCombatStatus, {
  UpdateCombatStatusParams
} from "./character/combat-status/use-cases/update-combat-status"
import addAdditionalEffect from "./character/effects/add-additional-effect"
import { DbEffectData } from "./character/effects/effects.types"
import subAdditionalEffects from "./character/effects/sub-additional-effects"
import addEffect, { AddEffectParams } from "./character/effects/use-cases/add-effect"
import removeEffect, { RemoveEffectParams } from "./character/effects/use-cases/remove-effect"
import updateCurrHp, { UpdateHpParams } from "./character/health/use-cases/update-curr-hp"
import updateHealth, { UpdateHealthParams } from "./character/health/use-cases/update-health"
import updateLimbsHp, { UpdateLimbsHpParams } from "./character/health/use-cases/update-limbs-hp"
import updateExp, { UpdateExpParams } from "./character/progress/use-cases/update-exp"
import adminEndFight, { AdminEndFightParams } from "./combat/use-cases/admin-end-fight"
import applyDamageEntries, {
  ApplyDamageEntriesParams
} from "./combat/use-cases/apply-damage-entries"
import createFight, { CreateFightParams } from "./combat/use-cases/create-fight"
import deleteFight, { DeleteFightParams } from "./combat/use-cases/delete-fight"
import doCombatAction, { CombatActionParams } from "./combat/use-cases/do-combat-action"
import endWait, { EndWaitParams } from "./combat/use-cases/end-wait"
import pickTarget, { PickTargetParams } from "./combat/use-cases/pick-target"
import prepareAction, { PrepareActionParams } from "./combat/use-cases/prepare-action"
import resetDifficulty, { ResetDifficultyParams } from "./combat/use-cases/reset-difficulty"
import saveAction, { SaveActionParams } from "./combat/use-cases/save-action"
import saveReaction, { SaveReactionParams } from "./combat/use-cases/save-reaction"
import setDifficulty, { SetDifficultyParams } from "./combat/use-cases/set-difficulty"
import startFight, { StartFightParams } from "./combat/use-cases/start-fight"
import updateAction, { UpdateActionParams } from "./combat/use-cases/update-action"
import updateRoll, { UpdateRollParams } from "./combat/use-cases/update-roll"
import waitAction, { WaitActionParams } from "./combat/use-cases/wait-action"
import { UseCasesConfig } from "./get-use-case.types"
import barter, { BarterParams } from "./inventory/use-cases/barter"
import consume, { ConsumeParams } from "./inventory/use-cases/consume"
import drop, { DropItemParams } from "./inventory/use-cases/drop"
import toggleEquip, { ToggleEquipParams } from "./inventory/use-cases/toggle-equip"
import createNpc, { CreateNpcParams } from "./npc/use-cases/create-npc"
import deleteNpc, { DeleteNpcParams } from "./npc/use-cases/delete-npc"
import updateAmmo, { UpdateAmmoParams } from "./objects/data/ammo/use-cases/update-ammo"
import updateCaps, { UpdateCapsParams } from "./objects/data/caps/use-cases/update-caps"
import addAdditionalClothing from "./objects/data/clothings/add-additional-clothings"
import { DbClothingData } from "./objects/data/clothings/clothings.types"
import subAdditionalClothings from "./objects/data/clothings/sub-additional-clothings"
import addAdditionalConsumable from "./objects/data/consumables/add-additional-consumable"
import { DbConsumableData } from "./objects/data/consumables/consumables.types"
import subAdditionalConsumables from "./objects/data/consumables/sub-additional-consumables"
import addAdditionalMisc from "./objects/data/misc-objects/add-addictional-misc"
import { DbMiscObjectData } from "./objects/data/misc-objects/misc-objects-types"
import subAdditionalMisc from "./objects/data/misc-objects/sub-additional-misc"
import loadWeapon, { LoadWeaponParams } from "./objects/data/weapons/use-cases/load-weapon"
import unloadWeapon, { UnloadWeaponParams } from "./objects/data/weapons/use-cases/unload-weapon"
import useWeapon, { UseWeaponParams } from "./objects/data/weapons/use-cases/use-weapon"
import {
  AdditionalClothingsParams,
  AdditionalConsumablesParams,
  AdditionalEffectsParams,
  AdditionalMiscParams
} from "./shared/db/api-rtdb"
import updateDate, { UpdateDateParams } from "./squad/use-cases/update-date"

export default function getUseCases(config: UseCasesConfig) {
  return {
    inventory: {
      barter: (data: BarterParams) => barter(config)(data),
      updateCaps: (data: UpdateCapsParams) => updateCaps(config)(data),
      updateAmmo: (data: UpdateAmmoParams) => updateAmmo(config)(data),
      drop: (data: DropItemParams) => drop(config)(data),
      consume: (data: ConsumeParams) => consume(config)(data)
    },
    weapons: {
      load: (data: LoadWeaponParams) => loadWeapon(config)(data),
      unload: (data: UnloadWeaponParams) => unloadWeapon(config)(data),
      useWeapon: (data: UseWeaponParams) => useWeapon(config)(data)
    },
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
      pickTarget: (data: PickTargetParams) => pickTarget(config)(data),
      updateRoll: (data: UpdateRollParams) => updateRoll(config)(data),
      saveReaction: (data: SaveReactionParams) => saveReaction(config)(data),
      // GM
      applyDamageEntries: (data: ApplyDamageEntriesParams) => applyDamageEntries(config)(data)
    },
    npc: {
      create: (data: CreateNpcParams) => createNpc(config)(data),
      delete: (params: DeleteNpcParams) => deleteNpc(config)(params)
    },
    character: {
      updateCombatStatus: (params: UpdateCombatStatusParams) => updateCombatStatus(config)(params),
      updateExp: (params: UpdateExpParams) => updateExp(config)(params),
      addEffect: (params: AddEffectParams) => addEffect(config)(params),
      removeEffect: (params: RemoveEffectParams) => removeEffect(config)(params),
      updateHp: (params: UpdateHpParams) => updateCurrHp(config)(params),
      updateLimbsHp: (params: UpdateLimbsHpParams) => updateLimbsHp(config)(params),
      toggleEquip: (params: ToggleEquipParams) => toggleEquip(config)(params),
      updateHealth: (params: UpdateHealthParams) => updateHealth(config)(params),
      updateKnowledges: (params: UpdateKnowledgesParams) => updateKnowledges(config)(params),
      updateUpSkills: (params: UpdateUpSkillsParams) => updateUpSkills(config)(params)
    },
    gm: {
      updateDatetime: (params: UpdateDateParams) => updateDate(config)(params)
    }
  }
}
