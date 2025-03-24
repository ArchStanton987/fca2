import { BackgroundId, RaceId } from "lib/character/status/status.types"

import { KnowledgeCategory, KnowledgeId, KnowledgeLevelValue } from "./knowledge-types"

type InitKnowledge = { id: KnowledgeId; levelId: KnowledgeLevelValue }
type InitAvailableCategory = {
  id: KnowledgeCategory
  levelId: KnowledgeLevelValue
}

export const knowledgesCategoryLabel: Record<KnowledgeCategory, string> = {
  weaponType: "Types d'armes",
  meleeCombat: "Combat au corps à corps",
  athletics: "Athlétisme",
  sensorial: "Sensoriel",
  social: "Social",
  medical: "Médical",
  technical: "Technique",
  stealth: "Discrétion",
  outdoorsman: "Survie"
}

// Free mandatory cumulative knowledges
export const RACE_INIT_KNOWLEDGES: Record<RaceId, InitKnowledge[]> = {
  human: [
    { id: "kBarter", levelId: 1 },
    { id: "kHear", levelId: 1 },
    { id: "kRunning", levelId: 1 },
    { id: "kSee", levelId: 1 },
    { id: "kSmell", levelId: 1 },
    { id: "kStrength", levelId: 1 },
    { id: "kStunt", levelId: 1 }
  ]
}

// Free non cumulative knowledge from a category
export const BACKGROUND_INIT_AVAILABLE_KNOWLEDGES_CATEGORIES: Record<
  BackgroundId,
  InitAvailableCategory[]
> = {
  jackal: [
    { id: "medical", levelId: 2 },
    { id: "outdoorsman", levelId: 2 }
  ],
  vaultDweller: [],
  raider: [],
  fiend: [],
  other: []
}
