import { SkillId } from "models/abilities/skills/SkillId"

export type Upskills = {
  [key in SkillId]: number
}
