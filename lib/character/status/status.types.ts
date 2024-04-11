import { DbLimbsHp } from "../health/health-types"

export type DbStatus = {
  background: string
  currAp: number
  exp: number
  level: number
  poison: number
  rads: number
} & DbLimbsHp

export type UpdatableStatusElement = Extract<keyof DbStatus, "exp">
