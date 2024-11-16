import {
  KnowledgeId,
  KnowledgeLevelValue
} from "lib/character/abilities/knowledges/knowledge-types"
import knowledgeLevels from "lib/character/abilities/knowledges/knowledges-levels"
import { Special } from "lib/character/abilities/special/special.types"
import { TraitId } from "lib/character/abilities/traits/traits.types"
import { BackgroundId, RaceId } from "lib/character/status/status.types"

import knowledgesMap from "../abilities/knowledges/knowledges"
import {
  BACKGROUND_INIT_AVAILABLE_KNOWLEDGES_CATEGORIES,
  RACE_INIT_KNOWLEDGES
} from "../abilities/knowledges/knowledges-const"

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

export const getInitSkillsPoints = (race = "human") => (race === "human" ? 60 : 60)

export const getInitKnowledgePoints = (race = "human") => (race === "human" ? 3 : 3)

export const getRawUsedKnowledgePoints = (knowledges: Record<KnowledgeId, KnowledgeLevelValue>) => {
  const kArray = Object.values(knowledges)
  return kArray.reduce((acc, curr) => {
    const level = knowledgeLevels.find(el => el.id === curr)
    if (!level) return acc
    return acc + level.cost
  }, 0)
}

export const getUsedKnowledgesPoints = (
  knowledges: Record<KnowledgeId, KnowledgeLevelValue>,
  background: BackgroundId,
  race: RaceId = "human"
) => {
  const rawUsedKnowledgePoints = getRawUsedKnowledgePoints(knowledges)

  // calculate free knowledges due to character race
  let raceInitKnowledgesCost = 0
  const freeKnowledges = RACE_INIT_KNOWLEDGES[race]
  freeKnowledges.forEach(k => {
    if (!knowledges[k.id]) return
    const level = knowledgeLevels.find(lvl => lvl.id === k.levelId)
    if (!level) return
    raceInitKnowledgesCost += level.cost
  })

  // calculate free knowledges due to character background
  let backgroundInitKnowledgesCost = 0
  const freeCategories = BACKGROUND_INIT_AVAILABLE_KNOWLEDGES_CATEGORIES[background]
  const knowledgesIds = Object.keys(knowledges) as KnowledgeId[]
  const knowledgesCategories = knowledgesIds.map(kId => knowledgesMap[kId].category)
  const freeCategory = freeCategories.find(cat => knowledgesCategories.includes(cat.id))
  if (freeCategory) {
    const level = knowledgeLevels.find(lvl => lvl.cost === freeCategory.levelId)
    if (level) {
      backgroundInitKnowledgesCost = level.cost
    }
  }

  // return the total used knowledge points
  return rawUsedKnowledgePoints - raceInitKnowledgesCost - backgroundInitKnowledgesCost
}

export const getRemainingFreeKnowledgesCost = (
  knowledges: Record<KnowledgeId, KnowledgeLevelValue>,
  background: BackgroundId
) => {
  const freeCategories = BACKGROUND_INIT_AVAILABLE_KNOWLEDGES_CATEGORIES[background]
  const knowledgesEntries = Object.entries(knowledges)
  const usedInFreeCategories = knowledgesEntries.reduce((acc, [kId, kLvl]) => {
    const currFreeCategory = freeCategories.find(
      cat => knowledgesMap[kId as KnowledgeId].category === cat.id
    )
    if (!currFreeCategory) return acc
    const usedCost = knowledgeLevels.find(lvl => lvl.id === kLvl)?.cost ?? 0
    return acc + usedCost
  }, 0)
  const freeAvailable = Math.min(...freeCategories.map(cat => cat.levelId as number))
  return Math.max(0, freeAvailable - usedInFreeCategories)
}
