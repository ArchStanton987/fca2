import Character from "lib/character/Character"
import effectsMap from "lib/character/effects/effects"
import { getExpiringEffects, getFollowingEffects } from "lib/character/effects/effects-utils"
import addEffect from "lib/character/effects/use-cases/add-effect"
import removeEffect from "lib/character/effects/use-cases/remove-effect"
import updateHp from "lib/character/health/use-cases/update-hp"
import updateLimbsHp from "lib/character/health/use-cases/update-limbs-hp"
import { UseCaseConfig } from "lib/get-use-cases"
import repositoryMap from "lib/shared/db/get-repository"

export type UpdateDateParams = {
  characters: Record<string, Character>
  squadId: string
  currDate: Date
  newDate: Date
}

export default function updateDate(config: UseCaseConfig) {
  const { db, createdElements } = config
  const allEffects = { ...createdElements.newEffects, ...effectsMap }

  const squadRepo = repositoryMap[db].squadRepository

  return async ({ characters, currDate, newDate, squadId }: UpdateDateParams) => {
    const promises = []
    Object.entries(characters).forEach(([charId, { effects, abilities, health }]) => {
      const { traits } = abilities
      const expiringEffects = getExpiringEffects(effects, traits, newDate)
      expiringEffects.forEach(expiredEffect => {
        promises.push(removeEffect(config)({ charId, dbKey: expiredEffect.dbKey }))
      })

      const followingEffects = getFollowingEffects(effects, traits, newDate, allEffects)
      followingEffects.forEach(({ effectId, startDate }) => {
        promises.push(addEffect(config)({ effectId, charId, startDate, effects, traits }))
      })

      const hasPoison = Object.values(effects).some(e => e.type === "poison")
      const hasMissingHp = health.missingHp > 0

      if (hasPoison || hasMissingHp) {
        const newHpValue = health.getNewHpOnTimePass(currDate, newDate, abilities.secAttr)
        promises.push(updateHp(config)({ charId, newHpValue }))

        const newLimbsHp = health.getNewLimbsOnTimePass(currDate, newDate, abilities.secAttr)
        promises.push(updateLimbsHp(config)({ charId, newLimbsHp }))
      }
    })
    promises.push(squadRepo.setChild({ id: squadId, childKey: "datetime" }, newDate.toJSON()))
    return promises
  }
}
