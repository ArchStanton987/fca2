import { getRepository } from "lib/RepositoryBuilder"
import { DbEffect, Effect, EffectData, EffectId } from "lib/character/effects/effects.types"
import { CreatedElements, defaultCreatedElements } from "lib/objects/created-elements"
import { CharType } from "lib/shared/db/api-rtdb"

import Playable from "../Playable"
import effectsMap from "./effects"

export const getEffectLengthInMs = (char: Playable, effect: EffectData) => {
  const isChemReliant = char.traits?.some(t => t.id === "chemReliant")
  if (!effect.length) return null
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
    get: (charType: CharType, charId: string, effectId: EffectId) =>
      repository.get(charType, charId, effectId),

    getAll: (charType: CharType, charId: string) => repository.getAll(charType, charId),

    add: async (char: Playable, effectId: EffectId, refDate?: Date, lengthInMs?: number) => {
      const dbEffect = createDbEffect(char, effectId, refDate, lengthInMs, allEffects)
      const existingEffect = char.effectsRecord[effectId]
      const charType = char.isEnemy ? "enemies" : "characters"
      if (existingEffect) {
        return repository.update(charType, char.charId, existingEffect.dbKey, dbEffect)
      }
      return repository.add(charType, char.charId, dbEffect)
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
      const charType = char.isEnemy ? "enemies" : "characters"
      const promises = [
        repository.groupAdd(charType, char.charId, newDbEffects),
        repository.groupUpdate(charType, char.charId, updatedDbEffects)
      ]
      return Promise.all(promises)
    },

    remove: async (charType: CharType, charId: string, effect: Effect) =>
      repository.remove(charType, charId, effect),

    groupRemove: (char: Playable, effects: Effect[]) => {
      const charType = char.isEnemy ? "enemies" : "characters"

      return repository.groupRemove(charType, char.charId, effects)
    }
  }
}

export default getEffectsUseCases
