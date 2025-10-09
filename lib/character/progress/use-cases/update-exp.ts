import { UseCasesConfig } from "lib/get-use-case.types"
import repositoryMap from "lib/shared/db/get-repository"

export type UpdateExpParams = {
  charId: string
  newExp: number
}

export default function updateExp({ db }: UseCasesConfig) {
  const playableRepo = repositoryMap[db].playableRepository

  return ({ charId, newExp }: UpdateExpParams) =>
    playableRepo.setChild({ id: charId, childKey: "exp" }, newExp)
}
