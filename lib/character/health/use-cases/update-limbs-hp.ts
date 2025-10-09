import { UseCasesConfig } from "lib/get-use-case.types"
import repositoryMap from "lib/shared/db/get-repository"

import { LimbId } from "../healthMap"

export type UpdateLimbsHpParams = {
  charId: string
  newLimbsHp: Partial<Record<LimbId, number>>
}

export default function updateLimbsHp({ db }: UseCasesConfig) {
  const healthRepo = repositoryMap[db].healthRepository

  return ({ charId, newLimbsHp }: UpdateLimbsHpParams) =>
    healthRepo.patchChild({ charId, childKey: "limbs" }, newLimbsHp)
}
