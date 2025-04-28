import repositoryMap from "lib/shared/db/get-repository"

export default function subAllNpc(dbType: keyof typeof repositoryMap = "rtdb") {
  const repository = repositoryMap[dbType].npcRepository
  return () => repository.subAll({})
}
