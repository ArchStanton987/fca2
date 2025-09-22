import { Special } from "../abilities/special/special.types"
import { getLevelAndThresholds } from "../status/status-calc"
import { LimbsHp } from "./health-types"
import { limbsMap } from "./healthMap"

export const getMaxHP = (baseSpecial: Special, exp: number) => {
  const baseMaxHP = baseSpecial.endurance * 2 + 15 + baseSpecial.strength
  const gainMaxHPPerLvl = Math.ceil(baseSpecial.endurance / 2) + 3
  const { level } = getLevelAndThresholds(exp)
  const levelGained = level - 1
  const result = levelGained * gainMaxHPPerLvl + baseMaxHP
  return result
}

export const getMissingHp = (limbsHp: LimbsHp) =>
  Object.values(limbsMap).reduce((acc, curr) => acc + (curr.maxValue - limbsHp[curr.id]), 0)
