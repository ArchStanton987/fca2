import { DbStatus } from "lib/character/status/status.types"
import repositoryMap from "lib/shared/db/get-repository"

export default function updateNpc(dbType: keyof typeof repositoryMap = "rtdb") {
  const enemyRepo = repositoryMap[dbType].npcRepository

  return (npcId: string, params: DbStatus) =>
    enemyRepo.setChild({ id: npcId, childKey: "status" }, params)
}
