import { LimbId } from "./limbs"

export type HealthStatusId = LimbId | "rads"

export type DbLimbs = {
  [L in LimbId]: number
}

export interface DbHealth {
  currHp: number
  limbs: Partial<DbLimbs>
  rads: number
}
