import { UseCaseConfig } from "lib/get-use-cases"
import { PlayableParams } from "lib/shared/db/api-rtdb"
import repositoryMap from "lib/shared/db/get-repository"

export default function subCharacter({ db }: UseCaseConfig) {
  const repository = repositoryMap[db].playableRepository
  return (params: PlayableParams) => repository.sub(params)
}
