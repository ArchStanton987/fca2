import {
  KnowledgeId,
  KnowledgeLevelValue
} from "lib/character/abilities/knowledges/knowledge-types"
import knowledgeLevels from "lib/character/abilities/knowledges/knowledges-levels"
import { Special } from "lib/character/abilities/special/special.types"
import { TraitId } from "lib/character/abilities/traits/traits.types"
import { BackgroundId } from "lib/character/status/status.types"

import knowledgesMap from "../abilities/knowledges/knowledges"
import {
  BACKGROUND_INIT_AVAILABLE_KNOWLEDGES_CATEGORIES,
  RACE_INIT_KNOWLEDGES
} from "../abilities/knowledges/knowledges-const"
import { SpeciesId } from "../meta/meta"

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

export const getAssignedFreeRaceKPoints = (
  knowledges: Record<KnowledgeId, KnowledgeLevelValue>,
  speciesId: SpeciesId = "human"
) => {
  const freeKnowledges = RACE_INIT_KNOWLEDGES[speciesId]
  return freeKnowledges.reduce((acc, k) => {
    if (!knowledges[k.id]) return acc
    const level = knowledgeLevels.find(lvl => lvl.id === k.levelId)
    if (!level) return acc
    return acc + level.cost
  }, 0)
}

export const getAssignedRawKPoints = (knowledges: Record<KnowledgeId, KnowledgeLevelValue>) =>
  Object.values(knowledges).reduce((acc, curr) => {
    const level = knowledgeLevels.find(el => el.id === curr)
    if (!level) return acc
    return acc + level.cost
  }, 0)

export const getRemainingFreeKPoints = (
  knowledges: Record<KnowledgeId, KnowledgeLevelValue>,
  background: BackgroundId,
  speciesId: SpeciesId = "human"
) => {
  const freeCategories = BACKGROUND_INIT_AVAILABLE_KNOWLEDGES_CATEGORIES[background]
  const freeCatIds = freeCategories.map(cat => cat.id)
  const freeLvl = Math.max(...freeCategories.map(c => c.levelId as number), 0)
  if (freeLvl === 0) return 0
  const spentLvlInFreeCat = Object.entries(knowledges).reduce((acc, [kId, kLvl]) => {
    const id = kId as KnowledgeId
    if (!freeCatIds.includes(knowledgesMap[id].category)) return acc

    const spentLvl = knowledgeLevels.find(lvl => lvl.id === kLvl)?.id ?? 0
    if (spentLvl === 0) return acc

    const freeRaceKnowledges = RACE_INIT_KNOWLEDGES[speciesId]
    const freeRaceLvl = freeRaceKnowledges.find(k => k.id === id)?.levelId ?? 0

    const backgroundSpendLvl = spentLvl - freeRaceLvl
    return acc + backgroundSpendLvl
  }, 0)

  const freeLvlRemaining = Math.max(0, freeLvl - spentLvlInFreeCat)
  return knowledgeLevels.find(lvl => lvl.id === freeLvlRemaining)?.cost ?? 0
}
