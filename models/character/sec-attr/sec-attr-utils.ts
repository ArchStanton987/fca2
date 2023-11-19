import { SpecialValues } from "../special/special-types"

export const getRange = (perception: SpecialValues["perception"]): number => {
  if (perception >= 10) return 70
  if (perception === 9) return 60
  if (perception === 8) return 50
  if (perception === 7) return 40
  if (perception === 6) return 30
  if (perception === 5) return 20
  if (perception === 4) return 15
  if (perception === 3) return 10
  if (perception === 2) return 5
  if (perception === 1) return 2
  return 0
}

export const getActionPoints = (agility: SpecialValues["agility"]): number => {
  if (agility >= 16) return 13
  if (agility >= 14) return 12
  if (agility >= 12) return 11
  if (agility >= 10) return 10
  if (agility >= 8) return 9
  if (agility >= 6) return 8
  if (agility >= 4) return 7
  if (agility >= 2) return 6
  if (agility === 1) return 5
  return 0
}
