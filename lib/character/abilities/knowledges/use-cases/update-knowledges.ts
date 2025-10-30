import { UseCasesConfig } from "lib/get-use-case.types"
import repositoryMap from "lib/shared/db/get-repository"

import { KnowledgeId, KnowledgeLevelValue } from "../knowledge-types"

export type UpdateKnowledgesParams = {
  charId: string
  newKnowledges: Partial<Record<KnowledgeId, KnowledgeLevelValue>>
}

export default function updateKnowledges(config: UseCasesConfig) {
  const { db } = config
  const abilitiesRepo = repositoryMap[db].abilitiesRepository

  return ({ charId, newKnowledges }: UpdateKnowledgesParams) =>
    abilitiesRepo.patchChild({ charId, childKey: "knowledges" }, newKnowledges)
}
