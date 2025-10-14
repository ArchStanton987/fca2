import { UseCasesConfig } from "lib/get-use-case.types"
import repositoryMap from "lib/shared/db/get-repository"

export type UpdateRadsParams = {
  charId: string
  newRadsValue: number
}

export default function updateRads({ db }: UseCasesConfig) {
  const healthRepo = repositoryMap[db].healthRepository

  return ({ charId, newRadsValue }: UpdateRadsParams) =>
    healthRepo.patch({ charId }, { rads: newRadsValue })
}
