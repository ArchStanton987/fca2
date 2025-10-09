import { UseCasesConfig } from "lib/get-use-case.types"
import { PlayableParams } from "lib/shared/db/api-rtdb"
import repositoryMap from "lib/shared/db/get-repository"

export default function subCharacter({ db }: UseCasesConfig) {
  const repository = repositoryMap[db].playableRepository
  return (params: PlayableParams) => repository.sub(params)
}
