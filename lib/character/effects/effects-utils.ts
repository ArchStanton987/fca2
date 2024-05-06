import Character from "lib/character/Character"
import effectsMap from "lib/character/effects/effects"
import { DbEffect, EffectData, EffectId } from "lib/character/effects/effects.types"

// export const getEffectLengthInH = (char: Character, effect: EffectData) => {
//   const isJunkie = char.dbAbilities.traits?.includes("chemReliant")
//   if (effect.length && effect.isWithdrawal && isJunkie) return effect.length * 0.5
//   return effect.length
// }

const getEffectLengthInH = (char: Character, effect: EffectData) => {
  const isJunkie = char.dbAbilities.traits?.includes("chemReliant")
  if (!effect.length) return null
  if (effect.length && effect.isWithdrawal && isJunkie) return effect.length * 0.5
  return effect.length
}

const getEffectLengthInMs = (char: Character, effect: EffectData) => {
  const effectLengthInH = getEffectLengthInH(char, effect)
  return effectLengthInH ? effectLengthInH * 60 * 60 * 1000 : null
}

export const createDbEffect = (char: Character, effectId: EffectId, refDate?: Date) => {
  const hasEffect = char.effects.some(effect => effect.id === effectId)
  if (hasEffect) throw new Error("Effect already exists")
  const dbEffect: DbEffect = { id: effectId, startTs: char.date.toJSON() }
  const length = getEffectLengthInH(char, effectsMap[effectId])
  if (length) {
    const lengthInMs = length * 3600 * 1000
    const startDate = refDate || char.date
    dbEffect.endTs = new Date(startDate.getTime() + lengthInMs).toJSON()
  }
  return dbEffect
}

export const getExpiringEffects = (char: Character, refDate: Date) =>
  char.effects.filter(effect => {
    // if (effect.endTs && effect?.endTs.getTime() < refDate.getTime()) return true
    // if (!effect.data.length) return false
    // if (!effect.startTs) return false
    // const effectLength = getEffectLengthInH(char, effect.data)
    // const lengthInH = effectLength || effect.data.length
    // return effect.startTs.getTime() + lengthInH * 3600 * 1000 < refDate.getTime()

    const { startTs, endTs, data } = effect
    const { length } = data
    if (!startTs || !length) return false
    if (endTs && endTs?.getTime() < refDate.getTime()) return true
    const effectLengthInMs = getEffectLengthInMs(char, data)
    if (!effectLengthInMs) return false
    return startTs.getTime() + effectLengthInMs < refDate.getTime()
  })

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
      const nextEffect = effectsMap[data.nextEffectId]
      const prevEffectLengthInMs = getEffectLengthInMs(char, data)
      const nextEffectLengthInMs = getEffectLengthInMs(char, nextEffect)
      if (!prevEffectLengthInMs || !nextEffectLengthInMs) return null
      const prevEffectEndTs = endTs?.getTime() || startTs.getTime() + prevEffectLengthInMs
      const nextEffectStartTs = prevEffectEndTs
      // return createDbEffect(char, data.nextEffectId, new Date(nextEffectStartTs))
      return createDbEffect(char, data.nextEffectId, new Date(nextEffectStartTs))
    })
    .filter(el => !!el)
