import { PlayableParams } from "lib/shared/db/api-rtdb"
import repositoryMap from "lib/shared/db/get-repository"

export default function subCharacter(dbType: keyof typeof repositoryMap = "rtdb") {
  const repository = repositoryMap[dbType].playableRepository
  return (params: PlayableParams) => repository.sub(params)
}
