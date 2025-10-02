import Abilities from "lib/character/abilities/Abilities"
import { UseCaseConfig } from "lib/get-use-cases"
import repositoryMap from "lib/shared/db/get-repository"

import Effect from "../Effect"
import effectsMap from "../effects"
import EffectsMappers from "../effects.mappers"
import { EffectId } from "../effects.types"

export type AddEffectParams = {
  effectId: EffectId
  effects: Record<EffectId, Effect>
  startDate: Date
  charId: string
  traits: Abilities["traits"]
  lengthInMs?: number
}

export default function addEffect({ db, createdElements }: UseCaseConfig) {
  const effectsRepo = repositoryMap[db].effectsRepository
  const allEffects = { ...effectsMap, ...createdElements.newEffects }

  return ({ effectId, charId, startDate, effects, traits, lengthInMs }: AddEffectParams) => {
    const effectData = allEffects[effectId]
    const existingEffect = effects[effectId]
    const dbEffect = EffectsMappers.toDb(traits, effectId, effectData, startDate, lengthInMs)
    if (existingEffect) {
      return effectsRepo.patch({ charId, dbKey: existingEffect.dbKey }, dbEffect)
    }
    return effectsRepo.add({ charId }, dbEffect)
  }
}
