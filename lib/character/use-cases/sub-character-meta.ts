import repositoryMap from "lib/shared/db/get-repository"

export default function subCharacterMeta(dbType: keyof typeof repositoryMap = "rtdb") {
  const repository = repositoryMap[dbType].characterRepository
  return (id: string) => repository.subChild({ id, childKey: "meta" })
}
