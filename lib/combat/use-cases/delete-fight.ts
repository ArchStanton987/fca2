import Playable from "lib/character/Playable"
import { CombatStatus, DbCombatStatus } from "lib/character/combat-status/combat-status.types"
import repositoryMap from "lib/shared/db/get-repository"

import Combat from "../Combat"

export type DeleteFightParams = {
  combat: Combat
  contenders: Record<string, { char: Playable; combatStatus: CombatStatus }>
}

export default function deleteFight(dbType: keyof typeof repositoryMap = "rtdb") {
  const combatRepo = repositoryMap[dbType].combatRepository
  const combatStatusRepo = repositoryMap[dbType].combatStatusRepository
  const characterRepo = repositoryMap[dbType].characterRepository

  return ({ combat, contenders }: DeleteFightParams) => {
    const promises: Promise<void>[] = []

    // delete combat entry
    promises.push(combatRepo.delete({ id: combat.id }))

    Object.entries(contenders).forEach(([charId, { char, combatStatus }]) => {
      const { secAttr, combats } = char
      // remove fight ID in characters combat archive
      if (combats[combat.id]) {
        const newCombats = { ...combats }
        delete newCombats[combat.id]
        promises.push(characterRepo.patch({ id: charId }, { combats: newCombats }))
      }

      // reset character ap, currFightId, combatStatus IF current combat is the one being deleted
      if (combatStatus.combatId === combat.id) {
        const defaultCombatStatus: DbCombatStatus = { currAp: secAttr.curr.actionPoints }
        promises.push(combatStatusRepo.set({ charId }, defaultCombatStatus))
      }
    })

    return Promise.all(promises)
  }
}
