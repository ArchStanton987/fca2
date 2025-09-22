import { Effect, EffectData, EffectId } from "lib/character/effects/effects.types"
import { getMissingHp } from "lib/character/health/health-calc"
import { getHealthState } from "lib/character/health/health-utils"
import { limbsMap, radStates } from "lib/character/health/healthMap"
import { DbStatus } from "lib/character/status/status.types"

import Playable from "../Playable"
import getEffectsUseCases, { getEffectLengthInMs } from "./effects-use-cases"

export const calculatedEffects: EffectData["type"][] = [
  "crippled",
  "healthState",
  "radState",
  "withdrawal"
]

export const getExpiringEffects = (char: Playable, refDate: Date) =>
  char.effects.filter(effect => {
    const { startTs, endTs, data } = effect
    const { length } = data
    if (!startTs || !length || !effect.dbKey) return false
    if (endTs && endTs?.getTime() < refDate.getTime()) return true
    const effectLengthInMs = getEffectLengthInMs(char, data)
    if (!effectLengthInMs) return false
    return startTs.getTime() + effectLengthInMs < refDate.getTime()
  }) as Effect[]

export const getFollowingEffects = (
  char: Playable,
  newDate: Date,
  allEffects: Record<EffectId, EffectData>
) =>
  getExpiringEffects(char, newDate)
    .filter(effect => {
      const { data, startTs, endTs } = effect
      if (!data.nextEffectId || !data.length || !startTs) return false
      const nextEffect = allEffects[data.nextEffectId]
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

export const handleLimbsEffects = (
  character: Playable,
  newStatus: DbStatus,
  effectsUseCases: ReturnType<typeof getEffectsUseCases>
): Promise<void>[] => {
  const promises: Promise<void>[] = []

  Object.values(limbsMap).forEach(({ id, crippledEffect }) => {
    const currValue = character.health.limbsHp[id]
    const newValue = newStatus[id]

    if (newValue !== currValue) {
      const currCripledEffect: Effect | undefined = character?.effectsRecord[crippledEffect]
      // remove cripled effect if the new value is greater than 0
      if (currCripledEffect && newValue > 0) {
        promises.push(effectsUseCases.remove(character.charId, currCripledEffect))
      }
      // add cripled effect if the new value is less than or equal to 0
      if (!currCripledEffect && newValue <= 0) {
        promises.push(effectsUseCases.add(character, crippledEffect))
      }
    }
  })

  return promises
}

export const handleHealthStatusEffects = (
  character: Playable,
  newStatus: DbStatus,
  effectsUseCases: ReturnType<typeof getEffectsUseCases>
): Promise<void>[] => {
  const promises: Promise<void>[] = []

  const { hp, maxHp } = character.health
  const currHealthState = getHealthState(hp, maxHp)
  const currHealthStateEffect = currHealthState ? character.effectsRecord[currHealthState] : null

  const newMissingHp = getMissingHp(newStatus)
  const newCurrHp = maxHp - newMissingHp
  const newHealthState = getHealthState(newCurrHp, maxHp)

  // add new health state effect if the new health state is different from the current one
  if (newHealthState && newHealthState !== currHealthState) {
    promises.push(effectsUseCases.add(character, newHealthState))
  }
  // remove current health state effect if the new health state is different from the current one
  if (currHealthStateEffect && newHealthState !== currHealthStateEffect.id) {
    promises.push(effectsUseCases.remove(character.charId, currHealthStateEffect))
  }

  return promises
}

export const handleRadsEffects = (
  character: Playable,
  newStatus: DbStatus,
  effectsUseCases: ReturnType<typeof getEffectsUseCases>
): Promise<void>[] => {
  const promises: Promise<void>[] = []

  const { rads } = character.health
  const newRads = newStatus.rads
  const radsState = radStates.find(el => rads > el.threshold)
  const radsStateEffect = radsState ? character.effectsRecord[radsState.id] : null

  const newRadsState = radStates.find(el => newRads > el.threshold)
  // add new rads state effect if the new rads state is different from the current one
  if (newRadsState && newRadsState.id !== radsStateEffect?.id) {
    promises.push(effectsUseCases.add(character, newRadsState.id))
  }
  // remove current rads state effect if the new rads state is different from the current one
  if (radsStateEffect && newRadsState?.id !== radsStateEffect.id) {
    promises.push(effectsUseCases.remove(character.charId, radsStateEffect))
  }

  return promises
}
