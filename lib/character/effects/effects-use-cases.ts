import { getRepository } from "lib/RepositoryBuilder"
import { DbEffect, Effect, EffectData, EffectId } from "lib/character/effects/effects.types"
import { CreatedElements, defaultCreatedElements } from "lib/objects/created-elements"

import Playable from "../Playable"
import effectsMap from "./effects"

export const getEffectLengthInMs = (char: Playable, effect: EffectData) => {
  const isChemReliant = char.traits?.some(t => t.id === "chemReliant")
  if (typeof effect?.length !== "number") return null
  const isWithdrawal = effect.type === "withdrawal"
  const lengthInH = isWithdrawal && isChemReliant ? effect.length * 0.5 : effect.length
  return lengthInH * 60 * 60 * 1000
}

const createDbEffect = (
  char: Playable,
  effectId: EffectId,
  startDate?: Date,
  effectLengthInMs?: number,
  withCreatedEffects: Record<EffectId, EffectData> = effectsMap
) => {
  const refStartDate = startDate || char.date
  const dbEffect: DbEffect = { id: effectId, startTs: refStartDate.toJSON() }
  const lengthInMs = effectLengthInMs ?? getEffectLengthInMs(char, withCreatedEffects[effectId])
  if (lengthInMs) {
    dbEffect.endTs = new Date(refStartDate.getTime() + lengthInMs).toJSON()
  }
  return dbEffect
}

function getEffectsUseCases(
  db: keyof typeof getRepository = "rtdb",
  { newEffects }: CreatedElements = defaultCreatedElements
) {
  const repository = getRepository[db].effects

  const allEffects = { ...effectsMap, ...newEffects }

  return {
    get: (charId: string, effectId: EffectId) => repository.get(charId, effectId),

    getAll: (charId: string) => repository.getAll(charId),

    add: async (char: Playable, effectId: EffectId, refDate?: Date, lengthInMs?: number) => {
      const dbEffect = createDbEffect(char, effectId, refDate, lengthInMs, allEffects)
      const existingEffect = char.effectsRecord[effectId]
      if (existingEffect) {
        return repository.update(char.charId, existingEffect.dbKey, dbEffect)
      }
      return repository.add(char.charId, dbEffect)
    },

    // we process one start date for each effect, as start dates can be different inside a batch of effects (e.g. datetime update)
    groupAdd: (
      char: Playable,
      effects: { effectId: EffectId; startDate?: Date; lengthInMs?: number }[]
    ) => {
      const newDbEffects: DbEffect[] = []
      const updatedDbEffects: { dbKey: Effect["dbKey"]; updatedEffect: DbEffect }[] = []
      effects.forEach(({ effectId, startDate, lengthInMs }) => {
        const dbEffect = createDbEffect(char, effectId, startDate, lengthInMs, allEffects)
        const existingEffect = char.effectsRecord[effectId]
        if (existingEffect) {
          updatedDbEffects.push({ dbKey: existingEffect.dbKey, updatedEffect: dbEffect })
        } else {
          newDbEffects.push(dbEffect)
        }
      })
      const promises = [
        repository.groupAdd(char.charId, newDbEffects),
        repository.groupUpdate(char.charId, updatedDbEffects)
      ]
      return Promise.all(promises)
    },

    remove: async (charId: string, effect: Effect) => repository.remove(charId, effect),

    groupRemove: (char: Playable, effects: Effect[]) => repository.groupRemove(char.charId, effects)
  }
}

export default getEffectsUseCases
