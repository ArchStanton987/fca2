import { UseCasesConfig } from "lib/get-use-case.types"
import repositoryMap from "lib/shared/db/get-repository"

import { SkillId } from "../skills.types"

export type UpdateUpSkillsParams = {
  charId: string
  newUpSkills: Partial<Record<SkillId, number>>
}

export default function updateUpSkills(config: UseCasesConfig) {
  const { db } = config
  const abilitiesRepo = repositoryMap[db].abilitiesRepository

  return ({ charId, newUpSkills }: UpdateUpSkillsParams) =>
    abilitiesRepo.patchChild({ charId, childKey: "upSkills" }, newUpSkills)
}
