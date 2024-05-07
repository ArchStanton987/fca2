import { getRepository } from "lib/RepositoryBuilder"
import Character from "lib/character/Character"
import getEffectsUseCases from "lib/character/effects/effects-use-cases"
import { getExpiringEffects, getFollowingEffects } from "lib/character/effects/effects-utils"
import { getNewLimbsHp } from "lib/character/health/health-utils"
import getStatusUseCases from "lib/character/status/status-use-cases"

function getSquadUseCases(db: keyof typeof getRepository = "rtdb") {
  const squadRepo = getRepository[db].squads

  return {
    get: (squadId: string) => squadRepo.get(squadId),

    getAll: () => squadRepo.getAll(),

    updateDate: (squadId: string, date: Date, characters: Character[]) => {
      const effectsUseCases = getEffectsUseCases(db)
      const statusUseCases = getStatusUseCases(db)

      const promises = []

      characters.forEach(char => {
        const expiringEffects = getExpiringEffects(char, date)
        promises.push(effectsUseCases.groupRemove(char, expiringEffects))

        const followingEffects = getFollowingEffects(char, date)
        promises.push(effectsUseCases.groupAdd(char, followingEffects))

        const newLimbsHp = getNewLimbsHp(char, date)
        promises.push(statusUseCases.groupUpdate(char.charId, newLimbsHp))
      })

      promises.push(squadRepo.updateElement(squadId, "datetime", date.toJSON()))

      return Promise.all(promises)
    }
  }
}

export default getSquadUseCases
