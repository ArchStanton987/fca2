import repositoryMap from "lib/shared/db/get-repository"

export default function subEnemies(dbType: keyof typeof repositoryMap = "rtdb") {
  const repository = repositoryMap[dbType].enemyRepository
  return (ids: string[]) => ids.map(id => repository.sub({ id }))
}
