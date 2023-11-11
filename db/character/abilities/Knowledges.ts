import { KnowledgeId } from "models/abilities/knowledges/knowledges"

export type Knowledges = {
  [key in KnowledgeId]: number
}
