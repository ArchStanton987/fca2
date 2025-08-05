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
  roll?: SimpleRoll | null
  oppositionRoll?: OppositionRoll | null
  healthChangeEntries?: DamageEntries | null
  itemId?: string
  itemDbKey?: string
  targetId?: string
  isSuccess?: boolean
  damageLocalization?: keyof LimbsHp
  aimZone?: keyof LimbsHp | null
  rawDamage?: number
  damageType?: DamageTypeId
  isDone?: boolean

  constructor(payload: Partial<WAction>) {
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
