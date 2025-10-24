import { ThenableReference } from "firebase/database"
import { getSecAttr } from "lib/character/abilities/abilities-provider"
import { getCombatStatus } from "lib/character/combat-status/combat-status-provider"
import { DbCombatStatus } from "lib/character/combat-status/combat-status.types"
import { UseCasesConfig } from "lib/get-use-case.types"
import repositoryMap from "lib/shared/db/get-repository"

import { getContenders } from "./sub-combat"

export type AdminEndFightParams = {
  combatId: string
}

export default function adminEndFight({ db, store }: UseCasesConfig) {
  const combatStatusRepo = repositoryMap[db].combatStatusRepository
  const playableRepo = repositoryMap[db].playableRepository

  return ({ combatId }: AdminEndFightParams) => {
    const promises: (Promise<void> | ThenableReference)[] = []

    const contenders = getContenders(store, combatId)

    Object.keys(contenders).forEach(charId => {
      const combatStatus = getCombatStatus(store, charId)
      // reset character ap, currFightId, combatStatus
      if (combatId === combatStatus.combatId) {
        const secAttr = getSecAttr(store, charId)
        const defaultCombatStatus: DbCombatStatus = {
          currAp: secAttr.curr.actionPoints
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
