import { LimbsHp } from "lib/character/health/health-types"
import { DamageTypeId } from "lib/objects/data/weapons/weapons.types"
import { computed, makeObservable, observable } from "mobx"

import { DamageEntries, OppositionRoll, SimpleRoll, WeaponActionSubtypeId } from "./combats.types"

interface WAction {
  actionType: "weapon"
  actionSubtype: WeaponActionSubtypeId
  actorId: string
  isCombinedAction?: boolean
  apCost: number
  roll: SimpleRoll | false
  oppositionRoll: OppositionRoll | false
  healthChangeEntries: DamageEntries | false
  itemId: string
  itemDbKey: string
  targetId: string
  isSuccess: boolean
  damageLocalization: keyof LimbsHp
  aimZone: keyof LimbsHp | false
  rawDamage: number
  damageType: DamageTypeId
  isDone: boolean
}

export default class WeaponAction {
  actionType?: "weapon"
  actionSubtype?: WeaponActionSubtypeId
  actorId?: string
  isCombinedAction?: boolean
  apCost?: number
  roll?: SimpleRoll | false
  oppositionRoll?: OppositionRoll | false
  healthChangeEntries?: DamageEntries | false
  itemId?: string
  itemDbKey?: string
  targetId?: string | false
  isSuccess?: boolean
  damageLocalization?: keyof LimbsHp | false
  aimZone?: keyof LimbsHp | false
  rawDamage?: number | false
  damageType?: DamageTypeId | false
  isDone?: boolean

  constructor(payload: Partial<WAction>) {
    this.actionType = payload.actionType
    this.actionSubtype = payload.actionSubtype
    this.actorId = payload.actorId
    this.isCombinedAction = payload.isCombinedAction
    this.apCost = payload.apCost
    this.roll = payload.roll
    this.isSuccess = payload.isSuccess
    this.isDone = payload.isDone

    makeObservable(this, {
      actionType: observable,
      actionSubtype: observable,
      actorId: observable,
      isCombinedAction: observable,
      apCost: observable,
      roll: observable,
      isSuccess: observable,
      isDone: observable,
      //
      combatStep: computed
    })
  }

  get combatStep() {
    if (this.isDone) return "AWAIT_ACTION_CREATION"
    const { actionType, actionSubtype, isCombinedAction, actorId } = this
    const actionTypeKeys = [actionType, actionSubtype, isCombinedAction, actorId]
    if (actionTypeKeys.some(e => e === undefined)) return "AWAIT_PICK_ACTION"
    const { apCost, roll } = this
    if (typeof apCost !== "number") return "AWAIT_AP_ASSIGNEMENT"

    if (this.targetId === undefined) return "AWAIT_PICK_TARGET"
    if (this.aimZone === undefined) return "AWAIT_AIM"

    if (roll === undefined) return "AWAIT_GM_DIFFICULTY"
    // with roll
    if (roll !== false) {
      const { actorDiceScore, actorSkillScore, difficultyModifier } = roll
      if (typeof difficultyModifier !== "number") return "AWAIT_GM_DIFFICULTY"
      if (typeof actorDiceScore !== "number") return "AWAIT_PLAYER_ROLL"
      if (typeof actorSkillScore !== "number") return "AWAIT_PLAYER_ROLL"
    }
    const { damageLocalization, oppositionRoll } = this
    // if (isDone === undefined) return "AWAIT_ACTION_VALIDATION"
    if (damageLocalization === undefined) return "AWAIT_DAMAGE_LOCALIZATION"
    if (oppositionRoll === undefined) return "AWAIT_REACTION"
    // with reaction
    if (oppositionRoll !== false) {
      const {
        opponentDiceScore,
        opponentApCost,
        opponentId,
        opponentSkillScore,
        opponentArmorClass
      } = oppositionRoll
      const isValidReaction =
        typeof opponentDiceScore === "number" &&
        opponentDiceScore !== 0 &&
        typeof opponentApCost === "number" &&
        typeof opponentId === "string" &&
        typeof opponentSkillScore === "number" &&
        opponentSkillScore !== 0 &&
        typeof opponentArmorClass === "number"
      if (!isValidReaction) return "AWAIT_REACTION_ROLL"
    }
    const { rawDamage, healthChangeEntries, isDone } = this
    if (rawDamage === undefined) return "AWAIT_DAMAGE_ROLL"
    if (healthChangeEntries === undefined) return "AWAIT_GM_DAMAGE"
    if (isDone === undefined) return "AWAIT_ACTION_VALIDATION"

    return "UNKNOWN_STEP"
  }
}
