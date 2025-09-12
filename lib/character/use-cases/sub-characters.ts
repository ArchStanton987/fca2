import repositoryMap from "lib/shared/db/get-repository"

export default function subCharacters(dbType: keyof typeof repositoryMap = "rtdb") {
  const repository = repositoryMap[dbType].playableRepository
  return (ids: string[]) => ids.map(id => repository.sub({ id }))
}
