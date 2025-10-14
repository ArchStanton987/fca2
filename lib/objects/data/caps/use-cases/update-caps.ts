import { UseCasesConfig } from "lib/get-use-case.types"
import repositoryMap from "lib/shared/db/get-repository"

export type UpdateCapsParams = {
  charId: string
  newValue: number
}

export default function updateCaps(config: UseCasesConfig) {
  const { db } = config
  const invRepo = repositoryMap[db].inventoryRepository

  return ({ newValue, charId }: UpdateCapsParams) =>
    invRepo.patchChild({ charId, childKey: "caps" }, newValue)
}
