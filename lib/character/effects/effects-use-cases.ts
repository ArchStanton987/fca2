import { getRepository } from "lib/RepositoryBuilder"
import Character from "lib/character/Character"
import { WithDbKeyEffect } from "lib/character/effects/FbEffectsRepository"
import { createDbEffect } from "lib/character/effects/effects-utils"
import { EffectId } from "lib/character/effects/effects.types"

function getEffectsUseCases(db: keyof typeof getRepository = "rtdb") {
  const repository = getRepository[db].effects

  return {
    get: (charId: string, effectId: EffectId) => repository.get(charId, effectId),

    getAll: (charId: string) => repository.getAll(charId),

    add: async (char: Character, effectId: EffectId, refDate?: Date) => {
      const dbEffect = createDbEffect(char, effectId, refDate)
      return repository.add(char.charId, dbEffect)
    },

    groupAdd: (char: Character, effects: { effectId: EffectId; startDate?: Date }[]) => {
      const dbEffects = effects
        .filter(({ effectId }) => !char.effects.some(eff => eff.id === effectId))
        .map(({ effectId, startDate }) => createDbEffect(char, effectId, startDate))
      return repository.groupAdd(char.charId, dbEffects)
    },

    remove: async (charId: string, effect: WithDbKeyEffect) => repository.remove(charId, effect),

    groupRemove: (char: Character, effects: WithDbKeyEffect[]) =>
      repository.groupRemove(char.charId, effects)
  }
}

export default getEffectsUseCases
