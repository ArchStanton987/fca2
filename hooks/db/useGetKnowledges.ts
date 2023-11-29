import dbKeys from "db/db-keys"

import useDbSubscribe from "hooks/db/useDbSubscribe"
import { KnowledgeId, KnowledgeLevelValue } from "models/character/knowledges/knowledge-types"

export type DbKnowledges = Record<KnowledgeId, KnowledgeLevelValue>

export default function useGetKnowledges(charId: string) {
  const dbPath = dbKeys.char(charId).knowledges

  return useDbSubscribe<DbKnowledges, DbKnowledges>(dbPath)
}
