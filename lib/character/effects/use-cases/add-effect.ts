import { getTraits } from "lib/character/abilities/abilities-provider"
import { getCharInfo } from "lib/character/info/info-provider"
import { UseCasesConfig } from "lib/get-use-case.types"
import repositoryMap from "lib/shared/db/get-repository"
import { getDatetime } from "lib/squad/use-cases/sub-squad"

import { getEffects } from "../effects-provider"
import EffectsMappers from "../effects.mappers"
import { EffectId } from "../effects.types"

export type AddEffectParams = {
  effectId: EffectId
  charId: string
  lengthInMs?: number
}

export default function addEffect({ db, collectiblesData, store }: UseCasesConfig) {
  const effectsRepo = repositoryMap[db].effectsRepository
  const allEffects = collectiblesData.effects

  return ({ effectId, charId, lengthInMs }: AddEffectParams) => {
    const effectData = allEffects[effectId]

    const charInfo = getCharInfo(store, charId)
    const currentCharEffects = getEffects(store, charId)
    const startDate = getDatetime(store, charInfo.squadId)
    const traits = getTraits(store, charId)
    const dbEffect = EffectsMappers.toDb(traits, effectId, effectData, startDate, lengthInMs)
    if (effectId in currentCharEffects) {
      const existingEffect = currentCharEffects[effectId]
      return effectsRepo.patch({ charId, dbKey: existingEffect.dbKey }, dbEffect)
    }
    return effectsRepo.add({ charId }, dbEffect)
  }
}
