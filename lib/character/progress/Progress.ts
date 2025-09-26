import { DbAbilities } from "../abilities/abilities.types"
import { DbCharInfo } from "../info/CharInfo"
import { getLevelAndThresholds } from "../status/status-calc"
import {
  getAssignedFreeRaceKPoints,
  getAssignedRawKPoints,
  getHpGainPerLevel,
  getInitKnowledgePoints,
  getInitSkillsPoints,
  getRemainingFreeKPoints,
  getSkillPointsPerLevel,
  getSpecLevelInterval
} from "./progress-utils"

export default class Progress {
  exp: number
  level: number
  hpGainPerLevel: number
  specLevelInterval: number
  usedSkillsPoints: number
  availableSkillPoints: number
  usedKnowledgePoints: number
  availableKnowledgePoints: number
  availableFreeKnowledgePoints: number

  constructor(exp: number, abilities: DbAbilities, meta: DbCharInfo) {
    const { baseSPECIAL, traits, knowledges = {}, upSkills } = abilities
    const traitsArray = Object.values(traits ?? {})

    const { background, speciesId } = meta

    this.exp = exp
    this.level = getLevelAndThresholds(exp).level
    this.hpGainPerLevel = getHpGainPerLevel(baseSPECIAL)
    this.specLevelInterval = getSpecLevelInterval(traitsArray)

    const initSkillPoints = getInitSkillsPoints()
    const skillPointsPerLevel = getSkillPointsPerLevel(baseSPECIAL, traitsArray)
    const unlockedSkillPoints = skillPointsPerLevel * (this.level - 1) + initSkillPoints
    this.usedSkillsPoints = Object.values(upSkills).reduce((acc, curr) => curr + acc, 0)
    this.availableSkillPoints = unlockedSkillPoints - this.usedSkillsPoints
    const initKPoints = getInitKnowledgePoints()
    const unlockedKnowledgePoints = initKPoints + (this.level - 1)
    const rawKpointsAssigned = getAssignedRawKPoints(knowledges)
    const freeRaceKPointsAssigned = getAssignedFreeRaceKPoints(knowledges, "human")
    this.usedKnowledgePoints = rawKpointsAssigned - freeRaceKPointsAssigned
    this.availableKnowledgePoints = unlockedKnowledgePoints - this.usedKnowledgePoints
    this.availableFreeKnowledgePoints = getRemainingFreeKPoints(knowledges, background, speciesId)
  }
}
