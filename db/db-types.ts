import { KnowledgeId, KnowledgeLevelValue } from "models/character/knowledges/knowledge-types"
import { PerkId } from "models/character/perks/perks-types"
import { SkillId } from "models/character/skills/skills-types"
import { SpecialValues } from "models/character/special/special-types"
import { TraitId } from "models/character/traits/traits-types"

export type DbObj<T> = Record<string, T> | null

export type DbAbilities = {
  baseSPECIAL: SpecialValues
  knownledges: Record<KnowledgeId, KnowledgeLevelValue>
  perks?: PerkId[]
  traits?: TraitId[]
  upSkills: {
    [key in SkillId]: number
  }
}
