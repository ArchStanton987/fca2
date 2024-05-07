/* eslint-disable import/prefer-default-export */
import Character from "lib/character/Character"
import { LimbHpId, limbsMap } from "lib/character/health/health"
import { getMissingHp } from "lib/character/health/health-calc"
import { getRandomArbitrary } from "lib/common/utils/dice-calc"

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
