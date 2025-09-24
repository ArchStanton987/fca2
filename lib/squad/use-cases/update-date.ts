import Squad from "lib/character/Squad"
import Abilities from "lib/character/abilities/Abilities"
import Effect from "lib/character/effects/Effect"
import { getExpiringEffects } from "lib/character/effects/effects-utils"
import { EffectId } from "lib/character/effects/effects.types"
import removeEffect from "lib/character/effects/use-cases/remove-effect"
import { CreatedElements, defaultCreatedElements } from "lib/objects/created-elements"
import { DbType } from "lib/shared/db/db.types"

type UpdateDateParams = {
  characters: Record<string, { effects: Record<EffectId, Effect>; abilities: Abilities }>
  newDate: Date
}

export default function updateDate(
  dbType: DbType = "rtdb",
  { newEffects }: CreatedElements = defaultCreatedElements
) {
  return ({ characters, newDate }: UpdateDateParams) => {
    const promises = []
    Object.entries(characters).forEach(([charId, char]) => {
      const expiringEffects = getExpiringEffects(char.effects, char.abilities.traits, newDate)
      expiringEffects.forEach(expiredEffect => {
        promises.push(removeEffect(dbType)({ charId, dbKey: expiredEffect.dbKey }))
      })

      // const followingEffects =
    })
  }
}
