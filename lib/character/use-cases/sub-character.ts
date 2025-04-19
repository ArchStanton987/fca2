import { CharacterParams } from "lib/shared/db/api-rtdb"
import repositoryMap from "lib/shared/db/get-repository"

export default function subCharacter(dbType: keyof typeof repositoryMap = "rtdb") {
  const repository = repositoryMap[dbType].characterRepository
  return (params: CharacterParams) => repository.sub(params)
}
