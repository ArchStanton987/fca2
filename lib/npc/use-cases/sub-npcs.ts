import repositoryMap from "lib/shared/db/get-repository"

export default function subNpcs(dbType: keyof typeof repositoryMap = "rtdb") {
  const repository = repositoryMap[dbType].npcRepository
  return (ids: string[]) => ids.map(id => repository.sub({ id }))
}
