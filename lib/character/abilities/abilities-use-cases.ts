import { getRepository } from "lib/RepositoryBuilder"
import {
  KnowledgeId,
  KnowledgeLevelValue
} from "lib/character/abilities/knowledges/knowledge-types"
import { SkillsValues } from "lib/character/abilities/skills/skills.types"
import { UseCasesConfig } from "lib/get-use-case.types"

function getAbilitiesUseCases({ db }: UseCasesConfig) {
  const repository = getRepository[db].abilities

  return {
    getAbilities: (charId: string) => repository.getAbilities(charId),

    updateUpSkills: (charId: string, newUpSkills: SkillsValues) =>
      repository.updateUpSkills(charId, newUpSkills),

    updateKnowledges: (charId: string, newKnowledges: Record<KnowledgeId, KnowledgeLevelValue>) =>
      repository.updateKnowledges(charId, newKnowledges)
  }
}

export default getAbilitiesUseCases
