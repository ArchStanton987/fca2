import { DbLimbsHp } from "../health/health-types"

export type DbStatus = {
  background: string
  currAp: number
  exp: number
  level: number
  poison: number
  rads: number
} & DbLimbsHp
