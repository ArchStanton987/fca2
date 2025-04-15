import repositoryMap from "lib/shared/db/get-repository"

export default function subEnemy(dbType: keyof typeof repositoryMap = "rtdb") {
  const repository = repositoryMap[dbType].enemyRepository
  return (id: string) => repository.sub({ id })
}
