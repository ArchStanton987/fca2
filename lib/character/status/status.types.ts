import { HealthStatusId } from "../health/health-types"

export type DbStatus = Record<StatusId, number>

export type StatusId =
  | "background"
  | "currAp"
  | "exp"
  | "level"
  | "poison"
  | "rads"
  | HealthStatusId
