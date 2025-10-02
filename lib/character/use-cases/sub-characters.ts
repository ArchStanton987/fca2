import { UseCaseConfig } from "lib/get-use-cases"
import repositoryMap from "lib/shared/db/get-repository"

export default function subCharacters({ db }: UseCaseConfig) {
  const repository = repositoryMap[db].playableRepository
  return (ids: string[]) => ids.map(id => repository.sub({ id }))
}
