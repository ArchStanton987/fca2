import { ThenableReference } from "firebase/database"
import Playable from "lib/character/Playable"
import repositoryMap from "lib/shared/db/get-repository"

import Combat from "../Combat"

export type AdminEndFightParams = {
  combat: Combat
  shouldDeleteNpcs?: boolean
  contenders: Record<string, Playable>
}

export default function adminEndFight(dbType: keyof typeof repositoryMap = "rtdb") {
  const statusRepo = repositoryMap[dbType].statusRepository
  const characterRepo = repositoryMap[dbType].characterRepository

  return ({ combat, contenders }: AdminEndFightParams) => {
    const promises: (Promise<void> | ThenableReference)[] = []
    Object.entries(contenders).forEach(([charId, { secAttr, combats, status }]) => {
      // reset character ap, currFightId, combatStatus
      if (status.currentCombatId === combat.id) {
        promises.push(statusRepo.patch({ charId }, { currAp: secAttr.curr.actionPoints }))
        promises.push(statusRepo.deleteChild({ charId, childKey: "combatStatus" }))
        promises.push(statusRepo.deleteChild({ charId, childKey: "currentCombatId" }))
      }
      const { id } = combat
      const newCombats = { ...combats, id }
      // add fight ID in characters combat archive
      promises.push(characterRepo.patch({ id: charId }, { combats: newCombats }))
    })

    // TODO: allow npc deletion
    // TODO: save combat as archived combat

    return Promise.all(promises)
  }
}
