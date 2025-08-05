import { computed, makeObservable, observable } from "mobx"

import { MovementType, SimpleRoll } from "./combats.types"

interface MovAction {
  actionType: "movement"
  actionSubtype: MovementType
  actorId: string
  isCombinedAction: boolean
  apCost: number
  roll: SimpleRoll | false
  isSuccess: boolean
  isDone: boolean
}

export default class MovementAction {
  actionType?: "movement"
  actionSubtype?: MovementType
  actorId?: string
  isCombinedAction?: boolean
  apCost?: number
  roll?: SimpleRoll | null
  isSuccess?: boolean
  isDone?: boolean

  constructor(payload: Partial<MovAction>) {
    this.actionType = payload.actionType
    this.actionSubtype = payload.actionSubtype
    this.actorId = payload.actorId
    this.isCombinedAction = payload.isCombinedAction
    this.apCost = payload.apCost
    this.roll = payload.roll === false ? null : payload.roll
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
    const { apCost, roll, isDone } = this
    if (typeof apCost !== "number") return "AWAIT_AP_ASSIGNEMENT"
    if (roll === undefined) return "AWAIT_GM_DIFFICULTY"
    // with roll
    if (roll !== null) {
      const { actorDiceScore, actorSkillScore, difficultyModifier } = roll
      if (typeof difficultyModifier !== "number") return "AWAIT_GM_DIFFICULTY"
      if (typeof actorDiceScore !== "number") return "AWAIT_PLAYER_ROLL"
      if (typeof actorSkillScore !== "number") return "AWAIT_PLAYER_ROLL"
    }
    if (isDone === undefined) return "AWAIT_ACTION_VALIDATION"
    return "UNKNOWN_STEP"
  }
}
