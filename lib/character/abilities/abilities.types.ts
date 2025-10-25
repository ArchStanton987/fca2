import { KnowledgeId, KnowledgeLevelValue } from "./knowledges/knowledge-types"
import { PerkId } from "./perks/perks.types"
import { SkillsValues } from "./skills/skills.types"
import { Special } from "./special/special.types"
import { TraitId } from "./traits/traits.types"

export type DbAbilities = {
  baseSPECIAL?: Special
  traits?: Partial<Record<TraitId, TraitId>>
  perks?: Partial<Record<PerkId, PerkId>>
  knowledges?: Partial<Record<KnowledgeId, KnowledgeLevelValue>>
  upSkills?: SkillsValues
}
