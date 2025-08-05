import { LimbsHp } from "lib/character/health/health-types"
import { DamageTypeId } from "lib/objects/data/weapons/weapons.types"
import { computed, makeObservable, observable } from "mobx"

import { DamageEntries, DbAction, OppositionRoll, SimpleRoll } from "./combats.types"

type PlayableId = string
type ItemId = string
type AimZone = keyof LimbsHp

export default class Action {
  actionType: string
  actionSubtype: string
  actorId: PlayableId
  isCombinedAction: boolean
  apCost: number
  roll: SimpleRoll | false
  oppositionRoll: OppositionRoll | false
  healthChangeEntries: DamageEntries | false
  itemId: ItemId
  itemDbKey: string
  targetId: string
  isSuccess: boolean
  damageLocalization: keyof LimbsHp
  aimZone: AimZone | false
  rawDamage: number
  damageType: DamageTypeId
  isDone: boolean

  constructor(payload: DbAction) {
    this.actionType = payload.actionType
    this.actionSubtype = payload.actionSubtype
    this.actorId = payload.actorId
    this.isCombinedAction = payload.isCombinedAction
    this.apCost = payload.apCost
    this.roll = payload.roll
    this.oppositionRoll = payload.oppositionRoll
    this.healthChangeEntries = payload.healthChangeEntries
    this.itemId = payload.itemId
    this.itemDbKey = payload.itemDbKey
    this.targetId = payload.targetId
    this.isSuccess = payload.isSuccess
    this.damageLocalization = payload.damageLocalization
    this.aimZone = payload.aimZone
    this.rawDamage = payload.rawDamage
    this.damageType = payload.damageType
    this.isDone = payload.isDone

    makeObservable(this, {
      actionType: observable,
      actionSubtype: observable,
      actorId: observable,
      isCombinedAction: observable,
      apCost: observable,
      roll: observable,
      oppositionRoll: observable,
      healthChangeEntries: observable,
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

    const { roll, apCost, isDone } = this
    if (typeof apCost !== "number") return "AWAIT_AP_ASSIGNEMENT"

    if (actionSubtype === "aim") {
    }

    if (roll === undefined) return "AWAIT_GM_DIFFICULTY"
    if (roll !== false) {
      const { actorDiceScore, actorSkillScore, difficultyModifier } = roll
      if (typeof difficultyModifier !== "number") return "AWAIT_GM_DIFFICULTY"
      if (typeof actorDiceScore !== "number") return "AWAIT_PLAYER_ROLL"
      if (typeof actorSkillScore !== "number") return "AWAIT_PLAYER_ROLL"
    }

    return "UNKNOWN_STEP"
  }
}
