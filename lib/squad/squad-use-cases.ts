import { getRepository } from "lib/RepositoryBuilder"
import Character from "lib/character/Character"
import { getExpiringEffects, getFollowingEffects } from "lib/character/effects/effects-utils"
import { getNewLimbsHp } from "lib/character/health/health-utils"
import useCases from "lib/common/use-cases"

function getSquadUseCases(db: keyof typeof getRepository = "rtdb") {
  const squadRepo = getRepository[db].squads

  return {
    get: (squadId: string) => squadRepo.get(squadId),

    getAll: () => squadRepo.getAll(),

    updateDate: (squadId: string, date: Date, characters: Character[]) => {
      const promises = []

      characters.forEach(char => {
        const expiringEffects = getExpiringEffects(char, date)
        promises.push(useCases.effects.groupRemove(char, expiringEffects))

        const followingEffects = getFollowingEffects(char, date)
        promises.push(useCases.effects.groupAdd(char, followingEffects))

        const newLimbsHp = getNewLimbsHp(char, date)
        promises.push(useCases.status.groupUpdate(char.charId, newLimbsHp))
      })

      squadRepo.updateElement(squadId, "datetime", date.toJSON())
    }
  }
}

export default getSquadUseCases
