import { Playable } from "lib/character/Playable"
import { DbCombatStatus } from "lib/character/combat-status/combat-status.types"
import { UseCaseConfig } from "lib/get-use-cases"
import repositoryMap from "lib/shared/db/get-repository"

export type DeleteFightParams = {
  gameId: string
  combatId: string
  contenders: Record<string, Playable>
}

export default function deleteFight({ db }: UseCaseConfig) {
  const combatRepo = repositoryMap[db].combatRepository
  const combatStatusRepo = repositoryMap[db].combatStatusRepository
  const playableRepo = repositoryMap[db].playableRepository
  const squadRepo = repositoryMap[db].squadRepository

  return ({ gameId, combatId, contenders }: DeleteFightParams) => {
    const promises: Promise<void>[] = []

    // delete combat entry
    promises.push(combatRepo.delete({ id: combatId }))
    // @ts-ignore
    promises.push(squadRepo.patchChild({ id: gameId, childKey: "combats" }, { [combatId]: null }))

    Object.entries(contenders).forEach(([charId, { abilities, combats, combatStatus }]) => {
      // remove fight ID in characters combat archive
      if (combats[combatId]) {
        const newCombats = { ...combats }
        delete newCombats[combatId]
        promises.push(playableRepo.patch({ id: charId }, { combats: newCombats }))
      }

      // reset character ap, currFightId, combatStatus IF current combat is the one being deleted
      if (combatStatus.combatId === combatId) {
        const { secAttr } = abilities
        const defaultCombatStatus: DbCombatStatus = { currAp: secAttr.curr.actionPoints }
        promises.push(combatStatusRepo.set({ charId }, defaultCombatStatus))
      }
    })

    return Promise.all(promises)
  }
}
