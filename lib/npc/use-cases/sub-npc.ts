import repositoryMap from "lib/shared/db/get-repository"

export default function subNpc(dbType: keyof typeof repositoryMap = "rtdb") {
  const repository = repositoryMap[dbType].npcRepository
  return (id: string) => repository.sub({ id })
}
