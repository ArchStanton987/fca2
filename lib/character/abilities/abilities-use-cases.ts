import { getRepository } from "lib/RepositoryBuilder"
import Character from "lib/character/Character"
import {
  KnowledgeId,
  KnowledgeLevelValue
} from "lib/character/abilities/knowledges/knowledge-types"
import { SkillsValues } from "lib/character/abilities/skills/skills.types"

function getAbilitiesUseCases(db: keyof typeof getRepository = "rtdb") {
  const repository = getRepository[db].abilities

  return {
    getAbilities: (charId: string) => repository.getAbilities(charId),

    updateUpSkills: (charId: string, newUpSkills: SkillsValues) =>
      repository.updateUpSkills(charId, newUpSkills),

    updateKnowledges: (
      character: Character,
      modKnowledges: { id: KnowledgeId; value: KnowledgeLevelValue }[]
    ) => {
      const newKnowledges = {} as Record<KnowledgeId, KnowledgeLevelValue>
      modKnowledges.forEach(({ id, value }) => {
        newKnowledges[id] += value
      })
      return repository.updateKnowledges(character.charId, newKnowledges)
    }
  }
}

export default getAbilitiesUseCases
