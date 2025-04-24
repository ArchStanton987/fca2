import repositoryMap from "lib/shared/db/get-repository"

export default function subCharacters(dbType: keyof typeof repositoryMap = "rtdb") {
  const repository = repositoryMap[dbType].characterRepository
  return (ids: string[]) => ids.map(id => repository.sub({ id, charType: "characters" }))
}
