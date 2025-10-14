import { CombatModId } from "../../combat/combat-mods"
import { KnowledgeId } from "../abilities/knowledges/knowledge-types"
import { SecAttrId } from "../abilities/sec-attr/sec-attr-types"
import { SkillId } from "../abilities/skills/skills.types"
import { SpecialId } from "../abilities/special/special.types"

export type Operation = "add" | "mult" | "abs"

type Modifiable = "currHp" | "rads"

export type ChangeableAttribute =
  | SpecialId
  | SecAttrId
  | SkillId
  | CombatModId
  | KnowledgeId
  // for modifiers
  | Modifiable

// Symptom is temporary, Modifier is permanent
export type Symptom = {
  id: ChangeableAttribute
  operation: Operation
  value: number
  level?: number
}
export type DbSymptoms = Partial<Record<ChangeableAttribute, Symptom>>
export type Modifier = {
  id: Modifiable
  operation: Operation
  value: number
}
export type DbModifiers = Partial<Record<Modifiable, Modifier>>
