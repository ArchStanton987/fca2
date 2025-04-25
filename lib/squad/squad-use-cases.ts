import { getRepository } from "lib/RepositoryBuilder"
import Playable from "lib/character/Playable"
import effectsMap from "lib/character/effects/effects"
import getEffectsUseCases from "lib/character/effects/effects-use-cases"
import { getExpiringEffects, getFollowingEffects } from "lib/character/effects/effects-utils"
import { getNewLimbsHp } from "lib/character/health/health-utils"
import getStatusUseCases from "lib/character/status/status-use-cases"
import { CreatedElements, defaultCreatedElements } from "lib/objects/created-elements"

function getSquadUseCases(
  db: keyof typeof getRepository = "rtdb",
  createdElements: CreatedElements = defaultCreatedElements
) {
  const squadRepo = getRepository[db].squads

  const allEffects = { ...effectsMap, ...createdElements.newEffects }

  return {
    get: (squadId: string) => squadRepo.get(squadId),

    getAll: () => squadRepo.getAll(),

    updateDate: (squadId: string, date: Date, characters: Playable[]) => {
      const effectsUseCases = getEffectsUseCases(db, createdElements)
      const statusUseCases = getStatusUseCases(db, createdElements)

      const promises = []

      characters.forEach(char => {
        const expiringEffects = getExpiringEffects(char, date)
        promises.push(effectsUseCases.groupRemove(char, expiringEffects))

        const followingEffects = getFollowingEffects(char, date, allEffects)
        promises.push(effectsUseCases.groupAdd(char, followingEffects))

        // TODO: add "types" for effects (poison, withdrawal, cripled, healthState, etc)
        const hasPoison = Object.values(char.effectsRecord).some(el => el.data.type === "poison")
        const isMissingHp = char.health.missingHp > 0

        // if character has poison or missing hp, his health might need to be updated
        if (hasPoison || isMissingHp) {
          const newLimbsHp = getNewLimbsHp(char, date)
          promises.push(statusUseCases.groupUpdate(char, newLimbsHp))
        }
      })

      promises.push(squadRepo.updateElement(squadId, "datetime", date.toJSON()))

      return Promise.all(promises)
    }
  }
}

export default getSquadUseCases
