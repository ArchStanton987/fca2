import { KnowledgeId, KnowledgeLevelValue } from "models/character/knowledges/knowledge-types"
import { PerkId } from "models/character/perks/perks-types"
import { SkillId } from "models/character/skills/skills-types"
import { SpecialValues } from "models/character/special/special-types"
import { TraitId } from "models/character/traits/traits-types"

import dbKeys from "../../db/db-keys"
import useDbSubscribe from "./useDbSubscribe"

export type DbAbilities = {
  baseSPECIAL: SpecialValues
  knownledges: Record<KnowledgeId, KnowledgeLevelValue>
  perks?: PerkId[]
  traits?: TraitId[]
  upSkills: {
    [key in SkillId]: number
  }
}

const handler = (snap: DbAbilities) => {
  const perks = snap?.perks ?? []
  const traits = snap?.traits ?? []
  return { ...snap, perks, traits }
}

export default function useGetAbilities(charId: string) {
  const dbPath = dbKeys.char(charId).abilities

  return useDbSubscribe(dbPath, handler)
}
