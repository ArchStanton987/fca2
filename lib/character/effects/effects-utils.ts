import Character from "lib/character/Character"
import effectsMap from "lib/character/effects/effects"
import { DbEffect, Effect, EffectData, EffectId } from "lib/character/effects/effects.types"

const getEffectLengthInMs = (char: Character, effect: EffectData) => {
  const isChemReliant = char.dbAbilities.traits?.includes("chemReliant")
  if (!effect.length) return null
  const lengthInH = effect.isWithdrawal && isChemReliant ? effect.length * 0.5 : effect.length
  return lengthInH * 60 * 60 * 1000
}

export const createDbEffect = (char: Character, effectId: EffectId, startDate?: Date) => {
  const refStartDate = startDate || char.date
  const dbEffect: DbEffect = { id: effectId, startTs: refStartDate.toJSON() }
  const lengthInMs = getEffectLengthInMs(char, effectsMap[effectId])
  if (lengthInMs) {
    dbEffect.endTs = new Date(refStartDate.getTime() + lengthInMs).toJSON()
  }
  return dbEffect
}

export const getExpiringEffects = (char: Character, refDate: Date) =>
  char.effects.filter(effect => {
    const { startTs, endTs, data } = effect
    const { length } = data
    if (!startTs || !length || !effect.dbKey) return false
    if (endTs && endTs?.getTime() < refDate.getTime()) return true
    const effectLengthInMs = getEffectLengthInMs(char, data)
    if (!effectLengthInMs) return false
    return startTs.getTime() + effectLengthInMs < refDate.getTime()
  }) as Effect[]

export const getFollowingEffects = (char: Character, newDate: Date) =>
  getExpiringEffects(char, newDate)
    .filter(effect => {
      const { data, startTs, endTs } = effect
      if (!data.nextEffectId || !data.length || !startTs) return false
      const nextEffect = effectsMap[data.nextEffectId]
      const prevEffectLengthInMs = getEffectLengthInMs(char, effect.data)
      const nextEffectLengthInMs = getEffectLengthInMs(char, nextEffect)
      if (!prevEffectLengthInMs || !nextEffectLengthInMs) return false
      const prevEffectEndTs = endTs?.getTime() || startTs.getTime() + prevEffectLengthInMs
      const nextEffectStartTs = prevEffectEndTs
      const nextEffectEndTs = nextEffectStartTs + nextEffectLengthInMs
      if (nextEffectEndTs < newDate.getTime()) return false
      return true
    })
    .map(el => {
      const { data, startTs, endTs } = el
      if (!data.nextEffectId || !data.length || !startTs) return null
      const prevEffectLengthInMs = getEffectLengthInMs(char, data)
      if (!prevEffectLengthInMs) return null
      const prevEffectEndTs = endTs?.getTime() || startTs.getTime() + prevEffectLengthInMs
      return { effectId: data.nextEffectId, startDate: new Date(prevEffectEndTs) }
    })
    .filter(el => !!el) as { effectId: EffectId; startDate: Date }[]
