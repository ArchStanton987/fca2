import Playable from "lib/character/Playable"
import repositoryMap from "lib/shared/db/get-repository"

import Combat from "../Combat"
import { PlayerCombatData } from "../combats.types"

export type UpdateContenderParams = {
  char: Playable
  combat: Combat
  payload: Partial<PlayerCombatData>
}

export default function updateContender(dbType: keyof typeof repositoryMap = "rtdb") {
  const contenderRepo = repositoryMap[dbType].contenderRepository

  return ({ char, combat, payload }: UpdateContenderParams) => {
    const contenderType = char.meta.isNpc ? "npcs" : "players"
    const combatId = combat.id
    const id = char.charId
    return contenderRepo.patch({ combatId, contenderType, id }, payload)
  }
}
