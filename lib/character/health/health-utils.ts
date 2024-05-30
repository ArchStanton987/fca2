/* eslint-disable import/prefer-default-export */
import Character from "lib/character/Character"
import { LimbHpId, healthStates, limbsMap } from "lib/character/health/health"
import { getMissingHp } from "lib/character/health/health-calc"
import { getRandomArbitrary } from "lib/common/utils/dice-calc"

import { EffectId } from "../effects/effects.types"

export const getNewLimbsHp = (char: Character, newDate: Date) => {
  const { healHpPerHour } = char.secAttr.curr
  const newLimbsHp = { ...char.health.limbsHp }
  if (healHpPerHour === 0) return newLimbsHp
  const hoursPassed = (newDate.getTime() - char.date.getTime()) / 3600000
  const limbsHpArray = Object.entries(char.health.limbsHp).map(([id, value]) => ({ id, value }))
  const hpDiff = Math.round(healHpPerHour * hoursPassed)

  // if hpDiff is positive, character is healing
  if (hpDiff > 0) {
    const missingHp = getMissingHp(char.status)
    const healedHp = Math.min(missingHp, hpDiff)
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

  // hpDiff can be negative if character is poisoned
  const baseDamageHp = Math.abs(hpDiff)
  const poisonDamageMultiplier = 1 - char.secAttr.curr.poisResist / 100
  // damage to be taken with poison resistance
  const damageHp = poisonDamageMultiplier * baseDamageHp
  for (let i = 0; i < damageHp; i += 1) {
    const limbsToTakeDamage = limbsHpArray.filter(({ value }) => value > 0)
    const randomIndex = getRandomArbitrary(0, limbsToTakeDamage.length)
    const limbIdToDamage = limbsToTakeDamage[randomIndex].id
    newLimbsHp[limbIdToDamage as LimbHpId] -= 1
  }
  return newLimbsHp
}

export const getHealthState = (currHp: number, maxHp: number): EffectId | null => {
  const currHpPercent = (currHp / maxHp) * 100
  const negativeValue = Math.max(currHp, currHpPercent)
  if (negativeValue < healthStates.vanished.min) return healthStates.vanished.id
  if (negativeValue < healthStates.dead.min) return healthStates.dead.id
  if (currHp < 1) return healthStates.woundedUnconscious.id
  if (currHpPercent < healthStates.woundedExhausted.min) return healthStates.woundedExhausted.id
  if (currHpPercent < healthStates.woundedTired.min) return healthStates.woundedTired.id
  return null
}
