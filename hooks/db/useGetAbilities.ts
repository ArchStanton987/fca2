import {
  KnowledgeId,
  KnowledgeLevelValue
} from "lib/character/abilities/knowledges/knowledge-types"
import { PerkId } from "lib/character/abilities/perks/perks.types"
import { SkillId } from "lib/character/abilities/skills/skills.types"
import { Special } from "lib/character/abilities/special/special.types"
import { TraitId } from "lib/character/abilities/traits/traits.types"

import dbKeys from "../../db/db-keys"
import useDbSubscribe from "./useDbSubscribe"

export type DbAbilities = {
  baseSPECIAL: Special
  knowledges: Partial<Record<KnowledgeId, KnowledgeLevelValue>>
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
