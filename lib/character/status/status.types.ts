import { HealthStatusId } from "../health/health-types"

export type StatusId = "background" | "currAp" | "exp" | "level" | "rads" | HealthStatusId

export type DbStatus = {
  background: string
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
