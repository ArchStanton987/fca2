import Playable from "lib/character/Playable"
import { CombatStatus, DbCombatStatus } from "lib/character/combat-status/combat-status.types"
import repositoryMap from "lib/shared/db/get-repository"

export type DeleteFightParams = {
  combatId: string
  contenders: Record<string, Playable>
  combatStatuses: Record<string, CombatStatus>
}

export default function deleteFight(dbType: keyof typeof repositoryMap = "rtdb") {
  const combatRepo = repositoryMap[dbType].combatRepository
  const combatStatusRepo = repositoryMap[dbType].combatStatusRepository
  const playableRepo = repositoryMap[dbType].playableRepository

  return ({ combatId, contenders, combatStatuses }: DeleteFightParams) => {
    const promises: Promise<void>[] = []

    // delete combat entry
    promises.push(combatRepo.delete({ id: combatId }))

    Object.entries(contenders).forEach(([charId, char]) => {
      const { secAttr, combats } = char
      // remove fight ID in characters combat archive
      if (combats[combatId]) {
        const newCombats = { ...combats }
        delete newCombats[combatId]
        promises.push(playableRepo.patch({ id: charId }, { combats: newCombats }))
      }

      // reset character ap, currFightId, combatStatus IF current combat is the one being deleted
      if (combatStatuses[charId].combatId === combatId) {
        const defaultCombatStatus: DbCombatStatus = { currAp: secAttr.curr.actionPoints }
        promises.push(combatStatusRepo.set({ charId }, defaultCombatStatus))
      }
    })

    return Promise.all(promises)
  }
}
