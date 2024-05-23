/* eslint-disable import/prefer-default-export */
import Character from "lib/character/Character"
import { LimbHpId, healthStates, limbsMap } from "lib/character/health/health"
import { getMissingHp } from "lib/character/health/health-calc"
import { getRandomArbitrary } from "lib/common/utils/dice-calc"

import { EffectId } from "../effects/effects.types"

export const getNewLimbsHp = (char: Character, newDate: Date) => {
  const { healHpPerHour } = char.secAttr.curr
  const hoursPassed = (newDate.getTime() - char.date.getTime()) / 3600000
  const missingHp = getMissingHp(char.status)
  const maxHealedHp = Math.round(healHpPerHour * hoursPassed)
  const healedHp = Math.min(missingHp, maxHealedHp)
  const newLimbsHp = { ...char.health.limbsHp }
  const limbsHpArray = Object.entries(char.health.limbsHp).map(([id, value]) => ({ id, value }))
  for (let i = 0; i < healedHp; i += 1) {
    const healableLimbs = limbsHpArray.filter(
      ({ value, id }) => value < limbsMap[id as LimbHpId].maxValue
    )
    const randomIndex = getRandomArbitrary(0, healableLimbs.length)
    const limbIdToHeal = healableLimbs[randomIndex].id
    newLimbsHp[limbIdToHeal as LimbHpId] += 1
  }
  return newLimbsHp
}

export const getHealthState = (currHp: number, maxHp: number): EffectId | null => {
  const currHpPercent = (currHp / maxHp) * 100
  // TODO: check in rules for negative values actions (dead = hp < -5 ? -END HP ?)
  const negativeValue = Math.max(currHp, currHpPercent)
  if (negativeValue < healthStates.vanished.min) return healthStates.vanished.id
  if (negativeValue < healthStates.dead.min) return healthStates.dead.id
  if (currHp < 1) return healthStates.woundedUnconscious.id
  if (currHpPercent < healthStates.woundedExhausted.min) return healthStates.woundedExhausted.id
  if (currHpPercent < healthStates.woundedTired.min) return healthStates.woundedTired.id
  return null
}
