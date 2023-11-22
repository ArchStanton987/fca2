import { SpecialValues } from "models/character/special/special-types"

export const getLevelAndThresholds = (exp: number) => {
  let level = 1
  let next = 1000
  let prev = 0
  while (next < exp) {
    prev = next
    level += 1
    next += level * 1000
  }
  return { level, prev, next }
}

export const getMaxHP = (special: SpecialValues, status: any) => {
  const baseMaxHP = special.endurance * 2 + 15 + special.strength
  const gainMaxHPPerLvl = Math.ceil(special.endurance / 2) + 3
  const { level } = getLevelAndThresholds(status.exp)
  const levelGained = level - 1
  const result = levelGained * gainMaxHPPerLvl + baseMaxHP
  return result
}
