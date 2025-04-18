import { CombatModId } from "../../combat/combat-mods"
import { KnowledgeId } from "../abilities/knowledges/knowledge-types"
import { SecAttrId } from "../abilities/sec-attr/sec-attr-types"
import { SkillId } from "../abilities/skills/skills.types"
import { SpecialId } from "../abilities/special/special.types"
import { HealthStatusId } from "../health/health-types"

export type Operation = "add" | "mult" | "abs"

export type ChangeableAttribute =
  | SpecialId
  | SecAttrId
  | SkillId
  | CombatModId
  | KnowledgeId
  | HealthStatusId

// Symptom is temporary, Modifier is permanent
export type Symptom = {
  id: ChangeableAttribute
  operation: Operation
  value: number
  level?: number
}
export type DbSymptoms = Record<ChangeableAttribute, Symptom>
export type Modifier = {
  id: HealthStatusId
  operation: Operation
  value: number
}
export type DbModifiers = Record<HealthStatusId, Modifier>
