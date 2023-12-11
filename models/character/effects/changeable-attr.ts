import combatModsMap from "models/character/combat-mod/combat-mods"
import healthMap from "models/character/health/health"
import knowledgesMap from "models/character/knowledges/knowledges"
import secAttrMap from "models/character/sec-attr/sec-attr"
import skillsMap from "models/character/skills/skills"
import specialMap from "models/character/special/special"

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

export const changeableAttributesMap: Record<ChangeableAttribute, Record<"short", string>> = {
  ...specialMap,
  ...secAttrMap,
  ...skillsMap,
  ...combatModsMap,
  ...knowledgesMap,
  ...healthMap
}
