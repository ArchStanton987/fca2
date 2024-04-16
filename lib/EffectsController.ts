import { getRepository } from "lib/RepositoryBuilder"
import Character from "lib/character/Character"
import effectsMap from "lib/character/effects/effects"
import { DbEffect, Effect, EffectId } from "lib/character/effects/effects.types"

function effectsController() {
  const db = "rtdb"
  const repository = getRepository[db].Effects()

  // TODO: add replace Effect logic

  const getDbEffect = (char: Character, effectId: EffectId) => {
    const hasEffect = char.effects.some(effect => effect.id === effectId)
    if (hasEffect) return null
    const dbEffect: DbEffect = { id: effectId, startTs: char.date.toJSON(), endTs: undefined }
    const length = char.getEffectLengthInH(effectsMap[effectId])
    if (length) {
      const lengthInMs = length * 3600 * 1000
      dbEffect.endTs = new Date(char.date.getTime() + lengthInMs).toJSON()
    }
    return dbEffect
  }

  return {
    get: (charId: string, effectId: EffectId) => repository.get(charId, effectId),

    getAll: (charId: string, effectId: EffectId) => repository.get(charId, effectId),

    add: async (char: Character, effectId: EffectId) => {
      const dbEffect = getDbEffect(char, effectId)
      return repository.add(char, dbEffect)
    },

    groupAdd: (char: Character, effectIds: EffectId[]) => {
      const dbEffects = effectIds
        .filter(effect => !char.effects.some(eff => eff.id === effect))
        .map(effectId => getDbEffect(char, effectId))
      return repository.groupAdd(char, dbEffects)
    },

    remove: async (char: Character, effect: Effect) => repository.remove(char, effect),

    groupRemove: (char: Character, effects: Effect[]) => repository.groupRemove(char, effects)
  }
}

export default effectsController()
