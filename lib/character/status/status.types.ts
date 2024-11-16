import { HealthStatusId } from "../health/health-types"

export type RaceId = "human"
export type BackgroundId = "jackal" | "vaultDweller"
export type StatusId = "background" | "currAp" | "exp" | "level" | "rads" | HealthStatusId

export type DbStatus = {
  background: BackgroundId
  currAp: number
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
