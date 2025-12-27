import { LimbId } from "lib/character/health/health.const"
import { DamageTypeId } from "lib/objects/data/weapons/weapons.types"

import { DamageEntries, DbAction, ReactionRoll, Roll } from "./combats.types"
import { ActionTypeId } from "./const/actions"

type PlayableId = string
type ItemId = string

export default class Action {
  actionType?: ActionTypeId | ""
  actionSubtype?: string
  actorId: PlayableId
  isCombinedAction?: boolean
  apCost?: number
  isDone?: boolean
  roll?: Roll | false
  reactionRoll?: ReactionRoll | false
  healthChangeEntries?: DamageEntries | false
  itemId?: ItemId | false
  itemDbKey?: string | false
  targetId?: string | false
  damageLocalizationScore?: number | false
  aimZone?: LimbId | false
  rawDamage?: number | false
  damageType?: DamageTypeId | false

  static getActionHasNoRoll = (action: DbAction) => {
    const { actionType, actionSubtype } = action
    const noRollTypes = ["prepare", "wait", "other"]
    if (actionType && noRollTypes.includes(actionType)) return true
    if (actionType === "item" && actionSubtype !== "throw") return true
    return false
  }

  static getActionIsAggressive = ({ actionSubtype }: DbAction) => {
    const aggressiveActionsSubtypes = ["basic", "aim", "burst", "throw", "hit"]
    return aggressiveActionsSubtypes.includes(actionSubtype ?? "")
  }

  static getActionHasNoItem = (action: DbAction) => {
    const noItemActions = ["movement", "other", "wait", "prepare", "other"]
    return noItemActions.includes(action.actionType ?? "")
  }

  static getIsRollMissed = (roll: Partial<Roll>) => {
    const { sumAbilities, dice, bonus, difficulty, targetArmorClass = 0 } = roll
    const hasNotRolled =
      sumAbilities === undefined ||
      dice === undefined ||
      bonus === undefined ||
      difficulty === undefined
    if (hasNotRolled) return false
    return sumAbilities - dice + bonus - targetArmorClass - difficulty < 0
  }

  constructor(payload: DbAction) {
    const { actionType, actionSubtype } = payload
    this.actionType = actionType ?? ""
    this.actionSubtype = actionSubtype
    this.actorId = payload.actorId ?? ""
    this.isCombinedAction = payload.isCombinedAction
    this.apCost = payload.apCost

    const hasNoRoll = Action.getActionHasNoRoll(payload)
    if (hasNoRoll) {
      this.roll = false
    } else {
      this.roll = payload.roll
    }

    const actionIsAggressive = Action.getActionIsAggressive(payload)
    if (actionIsAggressive) {
      this.reactionRoll = payload.reactionRoll
      this.targetId = payload.targetId
      this.rawDamage = payload.rawDamage
      this.damageType = payload.damageType
      this.damageLocalizationScore = payload.damageLocalizationScore
      this.healthChangeEntries = payload.healthChangeEntries
    } else {
      this.reactionRoll = false
      this.targetId = false
      this.rawDamage = false
      this.damageType = false
      this.damageLocalizationScore = false
      this.healthChangeEntries = false
    }

    const hasNoItem = Action.getActionHasNoItem(payload)
    if (hasNoItem) {
      this.itemId = false
      this.itemDbKey = false
    } else {
      this.itemId = payload.itemId
      this.itemDbKey = payload.itemDbKey
    }

    this.aimZone = actionSubtype === "aim" ? payload.aimZone : false
    this.isDone = payload.isDone
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
      const { dice, sumAbilities, difficulty } = roll
      if (typeof difficulty !== "number") return "AWAIT_GM_DIFFICULTY"
      if (typeof dice !== "number") return "AWAIT_PLAYER_ROLL"
      if (typeof sumAbilities !== "number") return "AWAIT_PLAYER_ROLL"
    }
    const { damageLocalizationScore, reactionRoll } = this
    if (damageLocalizationScore === undefined) return "AWAIT_DAMAGE_LOCALIZATION"
    if (reactionRoll === undefined) return "AWAIT_REACTION"
    // with reaction
    if (reactionRoll !== false) {
      const { opponentSumAbilities, opponentApCost, opponentId, opponentDice } = reactionRoll
      const isValidReaction =
        typeof opponentDice === "number" &&
        opponentDice !== 0 &&
        typeof opponentApCost === "number" &&
        typeof opponentId === "string" &&
        typeof opponentSumAbilities === "number" &&
        opponentSumAbilities !== 0
      if (!isValidReaction) return "AWAIT_REACTION_ROLL"
    }
    const { rawDamage, healthChangeEntries, isDone } = this
    if (rawDamage === undefined) return "AWAIT_DAMAGE_ROLL"
    if (healthChangeEntries === undefined) return "AWAIT_GM_DAMAGE"
    if (isDone === undefined) return "AWAIT_ACTION_VALIDATION"

    return "UNKNOWN_STEP"
  }
}
