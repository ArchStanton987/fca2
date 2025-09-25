import { getRepository } from "lib/RepositoryBuilder"
import repositoryMap from "lib/shared/db/get-repository"

import { LimbId } from "../healthMap"

export type UpdateLimbsHpParams = {
  charId: string
  newLimbsHp: Partial<Record<LimbId, number>>
}

export default function updateLimbsHp(dbType: keyof typeof repositoryMap = "rtdb") {
  const healthRepo = repositoryMap[dbType].healthRepository

  return ({ charId, newLimbsHp }: UpdateLimbsHpParams) =>
    healthRepo.patchChild({ charId, childKey: "limbs" }, newLimbsHp)
}
