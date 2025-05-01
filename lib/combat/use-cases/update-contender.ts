import repositoryMap from "lib/shared/db/get-repository"

export type UpdateContenderParams = {
  id: string
  playerId: string
  charType: "players" | "npcs"
  initiative: number
  nextActionBonus?: number
}

export default function updateContender(dbType: keyof typeof repositoryMap = "rtdb") {
  const combatRepo = repositoryMap[dbType].combatRepository

  return ({ id, playerId, charType, initiative, nextActionBonus }: UpdateContenderParams) =>
    combatRepo.patchChild(
      { id, childKey: charType },
      { [playerId]: { initiative, nextActionBonus: nextActionBonus ?? 0 } }
    )
}
