import { ThenableReference } from "firebase/database"
import Playable from "lib/character/Playable"
import { DbStatus } from "lib/character/status/status.types"
import repositoryMap from "lib/shared/db/get-repository"

import Combat from "../Combat"

export type CloseFightParams = {
  combat: Combat
  shouldDeleteNpcs?: boolean
  contenders: Record<string, Playable>
}

export default function closeFight(dbType: keyof typeof repositoryMap = "rtdb") {
  const statusRepo = repositoryMap[dbType].statusRepository
  const characterRepo = repositoryMap[dbType].characterRepository

  return ({ combat, contenders }: CloseFightParams) => {
    const promises: (Promise<void> | ThenableReference)[] = []
    Object.entries(contenders).forEach(([charId, { meta, secAttr, combats }]) => {
      const { isNpc } = meta
      const charType = isNpc ? ("npcs" as const) : ("characters" as const)
      const patchedStatus: Partial<DbStatus> = {
        combatStatus: undefined,
        currentCombatId: undefined,
        currAp: secAttr.curr.actionPoints
      }
      // reset character ap, currFightId, combatStatus
      promises.push(statusRepo.patch({ charId, charType }, patchedStatus))
      const { id, title, timestamp, description, location } = combat
      const newCombats = {
        ...combats,
        [id]: { id, title, date: timestamp.toJSON(), description, location }
      }
      // add fight ID in characters combat archive
      promises.push(characterRepo.patch({ charType, id: charId }, { combats: newCombats }))
    })

    // TODO: allow npc deletion
    // TODO: save combat as archived combat

    return Promise.all(promises)
  }
}
