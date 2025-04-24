import repositoryMap from "lib/shared/db/get-repository"

export type UpdateContenderParams = {
  id: string
  playerId: string
  charType: "players" | "enemies"
  initiative: number
}

export default function updateContender(dbType: keyof typeof repositoryMap = "rtdb") {
  const combatRepo = repositoryMap[dbType].combatRepository

  return ({ id, playerId, charType, initiative }: UpdateContenderParams) =>
    combatRepo.patchChild(
      { id, childKey: charType },
      { [playerId]: { initiative, nextActionBonus: 0 } }
    )
}
