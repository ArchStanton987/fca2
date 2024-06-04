import {
  KnowledgeId,
  KnowledgeLevelValue
} from "lib/character/abilities/knowledges/knowledge-types"
import knowledgeLevels from "lib/character/abilities/knowledges/knowledges-levels"
import { Special } from "lib/character/abilities/special/special.types"
import { TraitId } from "lib/character/abilities/traits/traits.types"
import { DbStatus } from "lib/character/status/status.types"

export const getHpGainPerLevel = (special: Special) => {
  const { endurance } = special
  return Math.ceil(endurance / 2) + 3
}

export const getSkillPointsPerLevel = (special: Special, traits: TraitId[]) => {
  const { intelligence } = special
  const traitsArray = Object.values(traits)
  if (traitsArray.includes("skilled")) {
    return 15 + intelligence
  }
  return 10 + intelligence
}

export const getSpecLevelInterval = (traits: TraitId[]) => {
  const traitsArray = Object.values(traits)
  if (traitsArray.includes("skilled")) {
    return 5
  }
  return 3
}

export const getGivenDamage = (traits: TraitId[]) => {
  const traitsArray = Object.values(traits)
  if (traitsArray.includes("finesse")) {
    return 0.5
  }
  return 1
}

export const getInitSkillsPoints = () => 60

export const getInitKnowledgePoints = (background: DbStatus["background"]) => {
  if (background === "jackal") {
    return 4
  }
  return 3
}

export const getUsedKnowledgesPoints = (knowledges: Record<KnowledgeId, KnowledgeLevelValue>) => {
  const kArray = Object.values(knowledges)
  return kArray.reduce((acc, curr) => {
    const level = knowledgeLevels.find(el => el.id === curr)
    if (!level) return acc
    return acc + level.cost
  }, 0)
}
