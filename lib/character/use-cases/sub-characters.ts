import { UseCasesConfig } from "lib/get-use-case.types"
import repositoryMap from "lib/shared/db/get-repository"

export default function subCharacters({ db }: UseCasesConfig) {
  const repository = repositoryMap[db].playableRepository
  return (ids: string[]) => ids.map(id => repository.sub({ id }))
}
