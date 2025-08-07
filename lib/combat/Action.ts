import { LimbsHp } from "lib/character/health/health-types"
import { DamageTypeId } from "lib/objects/data/weapons/weapons.types"
import { computed, makeObservable, observable } from "mobx"

import { DamageEntries, DbAction, OppositionRoll, SimpleRoll } from "./combats.types"
import {
  getActionHasNoItem,
  getActionHasNoRoll,
  getActionIsNotAggressive
} from "./utils/combat-utils"

type PlayableId = string
type ItemId = string
type AimZone = keyof LimbsHp

export default class Action {
  actionType?: string
  actionSubtype?: string
  actorId?: PlayableId
  isCombinedAction?: boolean
  apCost?: number
  isSuccess?: boolean
  isDone?: boolean
  roll?: SimpleRoll | false
  oppositionRoll?: OppositionRoll | false
  healthChangeEntries?: DamageEntries | false
  itemId?: ItemId | false
  itemDbKey?: string | false
  targetId?: string | false
  damageLocalization?: keyof LimbsHp | false
  aimZone?: AimZone | false
  rawDamage?: number | false
  damageType?: DamageTypeId | false

  constructor(payload: DbAction) {
    const { actionType, actionSubtype } = payload
    this.actionType = actionType
    this.actionSubtype = actionSubtype
    this.actorId = payload.actorId
    this.isCombinedAction = payload.isCombinedAction
    this.apCost = payload.apCost

    const hasNoRoll = getActionHasNoRoll(payload)
    if (hasNoRoll) {
      this.roll = false
      this.healthChangeEntries = false
    } else {
      this.roll = payload.roll
      this.healthChangeEntries = payload.healthChangeEntries
    }

    const actionIsNotAggressive = getActionIsNotAggressive(payload)
    if (actionIsNotAggressive) {
      this.oppositionRoll = false
      this.targetId = false
      this.rawDamage = false
      this.damageType = false
      this.damageLocalization = false
    } else {
      this.oppositionRoll = payload.oppositionRoll
      this.targetId = payload.targetId
      this.rawDamage = payload.rawDamage
      this.damageType = payload.damageType
      this.damageLocalization = payload.damageLocalization
    }

    const hasNoItem = getActionHasNoItem(payload)
    if (hasNoItem) {
      this.itemId = false
      this.itemDbKey = false
    } else {
      this.itemId = payload.itemId
      this.itemDbKey = payload.itemDbKey
    }

    this.aimZone = actionSubtype === "aim" ? payload.aimZone : false
    this.isDone = payload.isDone

    makeObservable(this, {
      actionType: observable,
      actionSubtype: observable,
      actorId: observable,
      isCombinedAction: observable,
      apCost: observable,
      roll: observable,
      oppositionRoll: observable,
      itemId: observable,
      itemDbKey: observable,
      targetId: observable,
      isSuccess: observable,
      damageLocalization: observable,
      aimZone: observable,
      rawDamage: observable,
      damageType: observable,
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
