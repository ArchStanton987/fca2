import { CombatModId } from "../combat-mod/combat-mod-types"
import { HealthStatusId } from "../health/health-types"
import { KnowledgeId } from "../knowledges/knowledge-types"
import { SecAttrId } from "../sec-attr/sec-attr-types"
import { SkillId } from "../skills/skills-types"
import { SpecialId } from "../special/special-types"

export type ChangeableAttribute =
  | SpecialId
  | SecAttrId
  | SkillId
  | CombatModId
  | KnowledgeId
  | HealthStatusId
