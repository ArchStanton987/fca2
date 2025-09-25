import { getRepository } from "lib/RepositoryBuilder"
import repositoryMap from "lib/shared/db/get-repository"

export type UpdateHpParams = {
  charId: string
  newHpValue: number
}

export default function updateHp(dbType: keyof typeof repositoryMap = "rtdb") {
  const healthRepo = repositoryMap[dbType].healthRepository

  return ({ charId, newHpValue }: UpdateHpParams) =>
    healthRepo.patch({ charId }, { currHp: newHpValue })
}
