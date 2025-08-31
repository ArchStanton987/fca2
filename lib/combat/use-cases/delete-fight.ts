import Playable from "lib/character/Playable"
import repositoryMap from "lib/shared/db/get-repository"

import Combat from "../Combat"

export type DeleteFightParams = {
  combat: Combat
  contenders: Record<string, Playable>
}

export default function deleteFight(dbType: keyof typeof repositoryMap = "rtdb") {
  const combatRepo = repositoryMap[dbType].combatRepository
  const statusRepo = repositoryMap[dbType].statusRepository
  const characterRepo = repositoryMap[dbType].characterRepository

  return ({ combat, contenders }: DeleteFightParams) => {
    const promises: Promise<void>[] = []

    // delete combat entry
    promises.push(combatRepo.delete({ id: combat.id }))

    Object.entries(contenders).forEach(([charId, { status, meta, secAttr, combats }]) => {
      const { isNpc } = meta
      const charType = isNpc ? ("npcs" as const) : ("characters" as const)
      // remove fight ID in characters combat archive
      if (combats[combat.id]) {
        const newCombats = { ...combats }
        delete newCombats[combat.id]
        promises.push(characterRepo.patch({ charType, id: charId }, { combats: newCombats }))
      }

      // reset character ap, currFightId, combatStatus IF current combat is the one being deleted
      if (status.currentCombatId !== combat.id) return
      promises.push(statusRepo.patch({ charId, charType }, { currAp: secAttr.curr.actionPoints }))
      promises.push(statusRepo.deleteChild({ charId, charType, childKey: "combatStatus" }))
      promises.push(statusRepo.deleteChild({ charId, charType, childKey: "currentCombatId" }))
    })

    return Promise.all(promises)
  }
}
