import { getSecAttr } from "lib/character/abilities/abilities-provider"
import { getPlayableCombatHistory } from "lib/character/combat-history/combat-history-provider"
import { getCombatStatus } from "lib/character/combat-status/combat-status-provider"
import { DbCombatStatus } from "lib/character/combat-status/combat-status.types"
import { UseCasesConfig } from "lib/get-use-case.types"
import repositoryMap from "lib/shared/db/get-repository"

import { getContenders } from "./sub-combats"

export type DeleteFightParams = {
  gameId: string
  combatId: string
}

export default function deleteFight(config: UseCasesConfig) {
  const { db, store } = config
  const combatRepo = repositoryMap[db].combatRepository
  const combatStatusRepo = repositoryMap[db].combatStatusRepository
  const playableRepo = repositoryMap[db].playableRepository
  const squadRepo = repositoryMap[db].squadRepository

  return ({ gameId, combatId }: DeleteFightParams) => {
    const promises: Promise<void>[] = []

    const contenders = getContenders(store, combatId)

    Object.values(contenders).forEach(charId => {
      // remove fight ID in characters combat archive
      const combatHistory = getPlayableCombatHistory(store, charId)
      if (combatHistory[combatId]) {
        const { [combatId]: removed, ...combats } = combatHistory
        promises.push(playableRepo.setChild({ id: charId, childKey: "combats" }, combats))
      }

      // reset character ap, currFightId, combatStatus IF current combat is the one being deleted
      const combatStatus = getCombatStatus(store, charId)
      const secAttr = getSecAttr(store, charId)
      if (combatStatus.combatId === combatId) {
        const defaultCombatStatus: DbCombatStatus = { currAp: secAttr.curr.actionPoints }
        promises.push(combatStatusRepo.set({ charId }, defaultCombatStatus))
      }
    })

    // delete combat entry
    promises.push(combatRepo.delete({ id: combatId }))
    // @ts-ignore
    promises.push(squadRepo.patchChild({ id: gameId, childKey: "combats" }, { [combatId]: null }))

    return Promise.all(promises)
  }
}
