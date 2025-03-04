import { getRepository } from "lib/RepositoryBuilder"
import Character from "lib/character/Character"
import { DbEffect, Effect, EffectData, EffectId } from "lib/character/effects/effects.types"
import { CreatedElements, defaultCreatedElements } from "lib/objects/created-elements"

import effectsMap from "./effects"
import { getEffectLengthInMs } from "./effects-utils"

const createDbEffect = (
  char: Character,
  effectId: EffectId,
  startDate?: Date,
  withCreatedEffects: Record<EffectId, EffectData> = effectsMap
) => {
  const refStartDate = startDate || char.date
  const dbEffect: DbEffect = { id: effectId, startTs: refStartDate.toJSON() }
  const lengthInMs = getEffectLengthInMs(char, withCreatedEffects[effectId])
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

    add: async (char: Character, effectId: EffectId, refDate?: Date) => {
      const dbEffect = createDbEffect(char, effectId, refDate, allEffects)
      const existingEffect = char.effectsRecord[effectId]
      if (existingEffect) {
        return repository.update(char.charId, existingEffect.dbKey, dbEffect)
      }
      return repository.add(char.charId, dbEffect)
    },

    // we process one start date for each effect, as start dates can be different inside a batch of effects (e.g. datetime update)
    groupAdd: (char: Character, effects: { effectId: EffectId; startDate?: Date }[]) => {
      const newDbEffects: DbEffect[] = []
      const updatedDbEffects: { dbKey: Effect["dbKey"]; updatedEffect: DbEffect }[] = []
      effects.forEach(({ effectId, startDate }) => {
        const dbEffect = createDbEffect(char, effectId, startDate, allEffects)
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

    groupRemove: (char: Character, effects: Effect[]) =>
      repository.groupRemove(char.charId, effects)
  }
}

export default getEffectsUseCases
