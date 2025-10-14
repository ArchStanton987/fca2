import { UseCasesConfig } from "lib/get-use-case.types"
import repositoryMap from "lib/shared/db/get-repository"

import { AmmoSet } from "../ammo.types"

export type UpdateAmmoParams = {
  charId: string
  ammo: Partial<AmmoSet>
}

export default function updateAmmo(config: UseCasesConfig) {
  const { db } = config
  const invRepo = repositoryMap[db].inventoryRepository

  return ({ charId, ammo }: UpdateAmmoParams) =>
    invRepo.patchChild({ charId, childKey: "ammo" }, ammo)
}
