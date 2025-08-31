import { getRepository } from "lib/RepositoryBuilder"
import {
  KnowledgeId,
  KnowledgeLevelValue
} from "lib/character/abilities/knowledges/knowledge-types"
import { SkillsValues } from "lib/character/abilities/skills/skills.types"
import { CharType } from "lib/shared/db/api-rtdb"

function getAbilitiesUseCases(db: keyof typeof getRepository = "rtdb") {
  const repository = getRepository[db].abilities

  return {
    getAbilities: (charType: CharType, charId: string) => repository.getAbilities(charType, charId),

    updateUpSkills: (charType: CharType, charId: string, newUpSkills: SkillsValues) =>
      repository.updateUpSkills(charType, charId, newUpSkills),

    updateKnowledges: (
      charType: CharType,
      charId: string,
      newKnowledges: Record<KnowledgeId, KnowledgeLevelValue>
    ) => repository.updateKnowledges(charType, charId, newKnowledges)
  }
}

export default getAbilitiesUseCases
