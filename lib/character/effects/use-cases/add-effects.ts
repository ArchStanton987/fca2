import { ThenableReference } from "firebase/database"
import Playable from "lib/character/Playable"
import { CreatedElements, defaultCreatedElements } from "lib/objects/created-elements"
import { DbType } from "lib/shared/db/db.types"
import repositoryMap from "lib/shared/db/get-repository"

import EffectsMappers from "../effects.mappers"
import { EffectId } from "../effects.types"

export type AddEffectsParams = {
  char: Playable
  effects: { effectId: EffectId; startDate?: Date; lengthInMs?: number }[]
}

export default function addEffects(
  dbType: DbType = "rtdb",
  { newEffects }: CreatedElements = defaultCreatedElements
) {
  const effectsRepo = repositoryMap[dbType].effectsRepository

  return ({ char, effects }: AddEffectsParams) => {
    const promises: (Promise<void> | ThenableReference)[] = []
    const { charId, isEnemy } = char
    const charType = isEnemy ? "enemies" : "characters"

    effects.forEach(({ effectId, startDate, lengthInMs }) => {
      const dbEffect = EffectsMappers.toDb(char, effectId, startDate, lengthInMs, newEffects)
      const existingEffect = char.effectsRecord[effectId]
      if (existingEffect) {
        promises.push(
          effectsRepo.patch({ charType, charId, dbKey: existingEffect.dbKey }, dbEffect)
        )
      } else {
        promises.push(effectsRepo.add({ charType, charId }, dbEffect))
      }
    })

    return Promise.all(promises)
  }
}
