import { getRepository } from "lib/RepositoryBuilder"
import Character from "lib/character/Character"
import effectsMap from "lib/character/effects/effects"
import { DbEffect, Effect, EffectId } from "lib/character/effects/effects.types"

const createDbEffect = (char: Character, effectId: EffectId) => {
  const hasEffect = char.effects.some(effect => effect.id === effectId)
  if (hasEffect) throw new Error("Effect already exists")
  const dbEffect: DbEffect = { id: effectId, startTs: char.date.toJSON() }
  const length = char.getEffectLengthInH(effectsMap[effectId])
  if (length) {
    const lengthInMs = length * 3600 * 1000
    dbEffect.endTs = new Date(char.date.getTime() + lengthInMs).toJSON()
  }
  return dbEffect
}

function controller(db: keyof typeof getRepository = "rtdb") {
  const repository = getRepository[db].effects

  // TODO: add replace Effect logic

  return {
    get: (charId: string, effectId: EffectId) => repository.get(charId, effectId),

    getAll: (charId: string) => repository.getAll(charId),

    add: async (char: Character, effectId: EffectId) => {
      const dbEffect = createDbEffect(char, effectId)
      return repository.add(char.charId, dbEffect)
    },

    groupAdd: (char: Character, effectIds: EffectId[]) => {
      const dbEffects = effectIds
        .filter(effect => !char.effects.some(eff => eff.id === effect))
        .map(effectId => createDbEffect(char, effectId))
      return repository.groupAdd(char.charId, dbEffects)
    },

    remove: async (charId: string, effect: Effect) => repository.remove(charId, effect),

    groupRemove: (char: Character, effects: Effect[]) =>
      repository.groupRemove(char.charId, effects)
  }
}

const effectsController = controller()
export default effectsController
