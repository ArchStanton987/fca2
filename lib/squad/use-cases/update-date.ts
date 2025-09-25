import Abilities from "lib/character/abilities/Abilities"
import Effect from "lib/character/effects/Effect"
import effectsMap from "lib/character/effects/effects"
import { getExpiringEffects, getFollowingEffects } from "lib/character/effects/effects-utils"
import { EffectId } from "lib/character/effects/effects.types"
import addEffect from "lib/character/effects/use-cases/add-effect"
import removeEffect from "lib/character/effects/use-cases/remove-effect"
import Health from "lib/character/health/Health"
import updateHp from "lib/character/health/use-cases/update-hp"
import updateLimbsHp from "lib/character/health/use-cases/update-limbs-hp"
import { CreatedElements, defaultCreatedElements } from "lib/objects/created-elements"
import { DbType } from "lib/shared/db/db.types"
import repositoryMap from "lib/shared/db/get-repository"

export type UpdateDateParams = {
  characters: Record<
    string,
    { effects: Record<EffectId, Effect>; abilities: Abilities; health: Health }
  >
  squadId: string
  currDate: Date
  newDate: Date
}

export default function updateDate(
  dbType: DbType = "rtdb",
  { newEffects }: CreatedElements = defaultCreatedElements
) {
  const allEffects = { ...newEffects, ...effectsMap }

  const squadRepo = repositoryMap[dbType].squadRepository

  return ({ characters, currDate, newDate, squadId }: UpdateDateParams) => {
    const promises = []
    Object.entries(characters).forEach(([charId, { effects, abilities, health }]) => {
      const { traits } = abilities
      const expiringEffects = getExpiringEffects(effects, traits, newDate)
      expiringEffects.forEach(expiredEffect => {
        promises.push(removeEffect(dbType)({ charId, dbKey: expiredEffect.dbKey }))
      })

      const followingEffects = getFollowingEffects(effects, traits, newDate, allEffects)
      followingEffects.forEach(({ effectId, startDate }) => {
        promises.push(addEffect(dbType)({ effectId, charId, startDate, effects, traits }))
      })

      const hasPoison = Object.values(effects).some(e => e.type === "poison")
      const hasMissingHp = health.missingHp > 0

      if (hasPoison || hasMissingHp) {
        const newHpValue = health.getNewHpOnTimePass(currDate, newDate, abilities.secAttr)
        promises.push(updateHp(dbType)({ charId, newHpValue }))

        const newLimbsHp = health.getNewLimbsOnTimePass(currDate, newDate, abilities.secAttr)
        promises.push(updateLimbsHp(dbType)({ charId, newLimbsHp }))
      }

      promises.push(squadRepo.setChild({ id: squadId, childKey: "datetime" }, newDate.toJSON()))
    })
  }
}
