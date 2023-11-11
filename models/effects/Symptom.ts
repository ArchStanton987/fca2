import { SpecialIdType } from "models/SPECIAL";
import { SecAttrIdType } from "models/SecAttr";
import { SkillIdType } from "models/Skill";

export type OperationType = "add" | "mult"

export type Symptom = {
  id: SpecialIdType | SecAttrIdType | SkillIdType 
  operation: OperationType
  value: number
}