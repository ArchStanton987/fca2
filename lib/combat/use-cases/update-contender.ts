import repositoryMap from "lib/shared/db/get-repository"

export type UpdateContenderParams = {
  id: string
  playerId: string
  charType: "players" | "npcs"
  initiative: number
  actionBonus?: number
  acBonus?: number
}

export default function updateContender(dbType: keyof typeof repositoryMap = "rtdb") {
  const combatRepo = repositoryMap[dbType].combatRepository

  return ({ id, playerId, charType, initiative, actionBonus, acBonus }: UpdateContenderParams) =>
    combatRepo.patchChild(
      { id, childKey: charType },
      { [playerId]: { initiative, actionBonus: actionBonus ?? 0, acBonus: acBonus ?? 0 } }
    )
}
