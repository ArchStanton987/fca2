import { ThenableReference } from "firebase/database"
import Character from "lib/character/Character"
import { DbCombatStatus } from "lib/character/combat-status/combat-status.types"
import repositoryMap from "lib/shared/db/get-repository"

export type AdminEndFightParams = {
  shouldDeleteNpcs?: boolean
  combatId: string
  contenders: Record<string, Character>
}

export default function adminEndFight(dbType: keyof typeof repositoryMap = "rtdb") {
  const combatStatusRepo = repositoryMap[dbType].combatStatusRepository
  const playableRepo = repositoryMap[dbType].playableRepository

  return ({ combatId, contenders }: AdminEndFightParams) => {
    const promises: (Promise<void> | ThenableReference)[] = []
    Object.entries(contenders).forEach(([charId, { abilities, combatStatus }]) => {
      // reset character ap, currFightId, combatStatus
      if (combatId === combatStatus.combatId) {
        const defaultCombatStatus: DbCombatStatus = {
          currAp: abilities.secAttr.curr.actionPoints
        }
        promises.push(combatStatusRepo.set({ charId }, defaultCombatStatus))
      }
      // add fight ID in characters combat archive
      promises.push(
        playableRepo.patchChild({ id: charId, childKey: "combats" }, { [combatId]: combatId })
      )
    })

    // TODO: allow npc deletion
    // TODO: save combat as archived combat

    return Promise.all(promises)
  }
}
