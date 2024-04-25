import Character from "lib/character/Character"
import effectsMap from "lib/character/effects/effects"
import { DbEffect, EffectData, EffectId } from "lib/character/effects/effects.types"

export const getEffectLengthInH = (char: Character, effect: EffectData) => {
  const isJunkie = char.dbAbilities.traits?.includes("chemReliant")
  if (effect.length && effect.isWithdrawal && isJunkie) return effect.length * 0.5
  return effect.length
}

export const createDbEffect = (char: Character, effectId: EffectId) => {
  const hasEffect = char.effects.some(effect => effect.id === effectId)
  if (hasEffect) throw new Error("Effect already exists")
  const dbEffect: DbEffect = { id: effectId, startTs: char.date.toJSON() }
  const length = getEffectLengthInH(char, effectsMap[effectId])
  if (length) {
    const lengthInMs = length * 3600 * 1000
    dbEffect.endTs = new Date(char.date.getTime() + lengthInMs).toJSON()
  }
  return dbEffect
}

export const getExpiringEffects = (char: Character, newDate: Date) =>
  char.effects.filter(effect => {
    if (effect.endTs && effect?.endTs.getTime() < newDate.getTime()) return true
    if (!effect.data.length) return false
    if (!effect.startTs) return false
    const effectLength = getEffectLengthInH(char, effect.data)
    const lengthInH = effectLength || effect.data.length
    return effect.startTs.getTime() + lengthInH * 3600 * 1000 < newDate.getTime()
  })

export const getFollowingEffects = (char: Character, newDate: Date) =>
  getExpiringEffects(char, newDate)
    .filter(effect => !!effect.data.nextEffectId && !!effect.endTs)
    .map(effect => {
      const newEffectId = effect.data.nextEffectId as EffectId
      const newEffectStartTs = new Date(effect.endTs as Date)
      const lengthInH = getEffectLengthInH(char, effectsMap[newEffectId]) as number
      const endInMs = newEffectStartTs.getTime() + lengthInH * 3600
      const endTs = new Date(endInMs).toJSON()
      return { id: newEffectId, endTs }
    })
