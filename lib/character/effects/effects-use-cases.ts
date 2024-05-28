import { getRepository } from "lib/RepositoryBuilder"
import Character from "lib/character/Character"
import { DbEffect, Effect, EffectId } from "lib/character/effects/effects.types"

function getEffectsUseCases(db: keyof typeof getRepository = "rtdb") {
  const repository = getRepository[db].effects

  return {
    get: (charId: string, effectId: EffectId) => repository.get(charId, effectId),

    getAll: (charId: string) => repository.getAll(charId),

    add: async (char: Character, effectId: EffectId, refDate?: Date) => {
      const dbEffect = repository.createDbEffect(char, effectId, refDate)
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
        const dbEffect = repository.createDbEffect(char, effectId, startDate)
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
