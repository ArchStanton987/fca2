import { HealthStatusId } from "../health/health-types"

export type BackgroundId = "jackal" | "vaultDweller" | "raider" | "fiend" | "other"
export type StatusId = "background" | "currAp" | "exp" | "level" | "rads" | HealthStatusId

export type DbStatus = {
  // combatStatus?: "active" | "wait" | "inactive" | "dead"
  // turnStatus?: "acting" | "waiting" | "pause" | "done"
  // currentCombatId?: string
  background: BackgroundId
  // currAp: number
  exp: number
  level: number
  headHp: number
  leftTorsoHp: number
  rightTorsoHp: number
  leftArmHp: number
  rightArmHp: number
  leftLegHp: number
  rightLegHp: number
  groinHp: number
  rads: number
}

export type UpdatableDbStatus = Omit<DbStatus, "background" | "level">
