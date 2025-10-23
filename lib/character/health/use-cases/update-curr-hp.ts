import { UseCasesConfig } from "lib/get-use-case.types"
import repositoryMap from "lib/shared/db/get-repository"

export type UpdateHpParams = {
  charId: string
  newHpValue: number
}

export default function updateCurrHp({ db }: UseCasesConfig) {
  const healthRepo = repositoryMap[db].healthRepository

  return ({ charId, newHpValue }: UpdateHpParams) =>
    healthRepo.patch({ charId }, { currHp: newHpValue })
}
