import Abilities from "lib/character/abilities/Abilities"
import { CreatedElements, defaultCreatedElements } from "lib/objects/created-elements"
import { DbType } from "lib/shared/db/db.types"
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

export default function addEffect(
  dbType: DbType = "rtdb",
  { newEffects }: CreatedElements = defaultCreatedElements
) {
  const effectsRepo = repositoryMap[dbType].effectsRepository
  const allEffects = { ...effectsMap, ...newEffects }

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
