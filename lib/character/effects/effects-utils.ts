import { EffectData, EffectId } from "lib/character/effects/effects.types"

import Abilities from "../abilities/Abilities"
import Effect from "./Effect"

export const calculatedEffects: EffectData["type"][] = [
  "crippled",
  "healthState",
  "radState",
  "withdrawal"
]

export const getExpiringEffects = (
  effects: Record<EffectId, Effect>,
  traits: Abilities["traits"],
  refDate: Date
) =>
  Object.values(effects).filter(effect => {
    const { startTs, endTs, data } = effect
    const { length } = data
    if (!startTs || !length || !effect.dbKey) return false
    if (endTs && endTs?.getTime() < refDate.getTime()) return true
    const effectLengthInMs = Effect.getEffectLengthInMs(traits, data)
    if (!effectLengthInMs) return false
    return startTs.getTime() + effectLengthInMs < refDate.getTime()
  })

export const getFollowingEffects = (
  effects: Record<EffectId, Effect>,
  traits: Abilities["traits"],
  refDate: Date,
  allEffects: Record<EffectId, EffectData>
) =>
  getExpiringEffects(effects, traits, refDate)
    .filter(effect => {
      const { data, startTs, endTs } = effect
      if (!data.nextEffectId || !data.length || !startTs) return false
      const nextEffect = allEffects[data.nextEffectId]
      const prevEffectLengthInMs = Effect.getEffectLengthInMs(traits, effect.data)
      const nextEffectLengthInMs = Effect.getEffectLengthInMs(traits, nextEffect)
      if (!prevEffectLengthInMs || !nextEffectLengthInMs) return false
      const prevEffectEndTs = endTs?.getTime() || startTs.getTime() + prevEffectLengthInMs
      const nextEffectStartTs = prevEffectEndTs
      const nextEffectEndTs = nextEffectStartTs + nextEffectLengthInMs
      if (nextEffectEndTs < refDate.getTime()) return false
      return true
    })
    .map(el => {
      const { data, startTs, endTs } = el
      if (!data.nextEffectId || !data.length || !startTs) return null
      const prevEffectLengthInMs = Effect.getEffectLengthInMs(traits, data)
      if (!prevEffectLengthInMs) return null
      const prevEffectEndTs = endTs?.getTime() || startTs.getTime() + prevEffectLengthInMs
      return { effectId: data.nextEffectId, startDate: new Date(prevEffectEndTs) }
    })
    .filter(el => !!el) as { effectId: EffectId; startDate: Date }[]
