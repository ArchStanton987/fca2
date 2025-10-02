import { UseCaseConfig } from "lib/get-use-cases"
import repositoryMap from "lib/shared/db/get-repository"

export type UpdateHpParams = {
  charId: string
  newHpValue: number
}

export default function updateHp({ db }: UseCaseConfig) {
  const healthRepo = repositoryMap[db].healthRepository

  return ({ charId, newHpValue }: UpdateHpParams) =>
    healthRepo.patch({ charId }, { currHp: newHpValue })
}
