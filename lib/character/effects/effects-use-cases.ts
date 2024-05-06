import { getRepository } from "lib/RepositoryBuilder"
import Character from "lib/character/Character"
import { createDbEffect } from "lib/character/effects/effects-utils"
import { Effect, EffectId } from "lib/character/effects/effects.types"

type EffectsConstr = { effectId: EffectId; refDate?: Date }

function getEffectsUseCases(db: keyof typeof getRepository = "rtdb") {
  const repository = getRepository[db].effects

  // TODO: add replace Effect logic

  return {
    get: (charId: string, effectId: EffectId) => repository.get(charId, effectId),

    getAll: (charId: string) => repository.getAll(charId),

    add: async (char: Character, effectId: EffectId, refDate?: Date) => {
      const dbEffect = createDbEffect(char, effectId, refDate)
      return repository.add(char.charId, dbEffect)
    },

    // groupAdd: (char: Character, effectIds: EffectId[], refDate?: Date) => {
    groupAdd: (char: Character, effects: EffectsConstr[]) => {
      const dbEffects = effects
        .filter(({ effectId }) => !char.effects.some(eff => eff.id === effectId))
        .map(({ effectId, refDate }) => createDbEffect(char, effectId, refDate))
      return repository.groupAdd(char.charId, dbEffects)
    },

    remove: async (charId: string, effect: Effect & Required<Pick<Effect, "dbKey">>) =>
      repository.remove(charId, effect),

    groupRemove: (char: Character, effects: Effect[]) =>
      repository.groupRemove(char.charId, effects)
  }
}

export default getEffectsUseCases
