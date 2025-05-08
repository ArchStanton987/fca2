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
  const combatRepo = repositoryMap[dbType].combatRepository

  return ({ id, playerId, charType, initiative, actionBonus, acBonus }: UpdateContenderParams) =>
    combatRepo.patchChild(
      { id, childKey: charType },
      { [playerId]: { initiative, actionBonus: actionBonus ?? 0, acBonus: acBonus ?? 0 } }
    )
}
