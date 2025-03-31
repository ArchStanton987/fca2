import repositoryMap from "lib/shared/db/get-repository"

export default function subAllEnemies(dbType: keyof typeof repositoryMap = "rtdb") {
  const repository = repositoryMap[dbType].enemyRepository
  return () => repository.sub({})
}
