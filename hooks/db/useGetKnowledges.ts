import dbKeys from "db/db-keys"
import {
  KnowledgeId,
  KnowledgeLevelValue
} from "lib/character/abilities/knowledges/knowledge-types"

import useDbSubscribe from "hooks/db/useDbSubscribe"

export type DbKnowledges = Partial<Record<KnowledgeId, KnowledgeLevelValue>>

export default function useGetKnowledges(charId: string) {
  const dbPath = dbKeys.char(charId).knowledges

  return useDbSubscribe<DbKnowledges, DbKnowledges>(dbPath)
}
