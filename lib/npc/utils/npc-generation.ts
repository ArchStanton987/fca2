import { DbChar } from "lib/character/Character"
import {
  KnowledgeId,
  KnowledgeLevelValue
} from "lib/character/abilities/knowledges/knowledge-types"
import { defaultSkillsValues } from "lib/character/abilities/skills/skills"
import { SkillId } from "lib/character/abilities/skills/skills.types"
import { getUpSkillCost } from "lib/character/abilities/skills/utils/skills-utils"
import { Special } from "lib/character/abilities/special/special.types"
import { TraitId } from "lib/character/abilities/traits/traits.types"
import { limbsDefault } from "lib/character/health/health"
import { getInitSkillsPoints, getSkillPointsPerLevel } from "lib/character/progress/progress-utils"
import { getExpForLevel } from "lib/character/status/status-calc"
import { BackgroundId, DbStatus } from "lib/character/status/status.types"
import { getRandomArbitrary } from "lib/common/utils/dice-calc"
import { DbEquipedObjects, DbInventory } from "lib/objects/data/objects.types"
import { getRandomWeightedIndex } from "lib/shared/utils/math-utils"

import humanTemplates from "../const/human-templates"

export const getSpecialFromTemplate = (specialTemplate: keyof typeof humanTemplates) => {
  const { special } = humanTemplates[specialTemplate]
  const result = {
    strength: getRandomArbitrary(special.strength.min, special.strength.max),
    perception: getRandomArbitrary(special.perception.min, special.perception.max),
    endurance: getRandomArbitrary(special.endurance.min, special.endurance.max),
    charisma: getRandomArbitrary(special.charisma.min, special.charisma.max),
    intelligence: getRandomArbitrary(special.intelligence.min, special.intelligence.max),
    agility: getRandomArbitrary(special.agility.min, special.agility.max),
    luck: getRandomArbitrary(special.luck.min, special.luck.max)
  }
  return result
}

export const getTraitsFromTemplate = (traitsTemplate: keyof typeof humanTemplates) => {
  const { traits } = humanTemplates[traitsTemplate]
  if (!traits) return []
  const result = Object.entries(traits)
    .map(([trait, p]) => ({
      trait: trait as TraitId,
      has: getRandomArbitrary(1, 101) < p * 100
    }))
    .filter(t => t.has)
    .map(t => t.trait)
  return result
}

const getMaxTagSkills = (level: number) => Math.round(level / 5) + 2
const getMaxSkillScore = (level: number) => 80 + level * 5

export const getTagSkillsFromTemplate = (
  level: number,
  skillsTemplate: keyof typeof humanTemplates
) => {
  const maxCount = getMaxTagSkills(level)
  const { tagSkills, mandatorySkills } = humanTemplates[skillsTemplate]
  const result = new Set(mandatorySkills)
  const pickedSkills = Object.entries(tagSkills)
    .map(([skill, p]) => ({ skill: skill as SkillId, has: getRandomArbitrary(1, 101) < p * 100 }))
    .filter(t => t.has)
  const toDelete = mandatorySkills.length + pickedSkills.length - maxCount
  for (let i = 0; i < toDelete; i += 1) {
    const randomIndex = getRandomArbitrary(0, pickedSkills.length - 1)
    pickedSkills[randomIndex].has = false
  }
  pickedSkills.filter(s => s.has).forEach(t => result.add(t.skill))
  return Array.from(result)
}

export const getUpSkillsScores = (
  level: number,
  tagSkills: SkillId[],
  special: Special,
  traits: TraitId[] = []
) => {
  const initSkillPoints = getInitSkillsPoints()
  const skillPointsPerLevel = getSkillPointsPerLevel(special, traits || [])
  const unlockedSkillPoints = skillPointsPerLevel * (level - 1) + initSkillPoints
  let remainingSkillPoints = unlockedSkillPoints
  const skills = { ...defaultSkillsValues }
  while (remainingSkillPoints > 0) {
    const isRandomSkill = getRandomArbitrary(0, 101) < 0.1 * 100
    let skillId
    if (isRandomSkill) {
      const randomSkillIndex = getRandomArbitrary(0, Object.keys(defaultSkillsValues).length - 1)
      skillId = Object.keys(skills)[randomSkillIndex] as SkillId
    } else {
      skillId = tagSkills[getRandomWeightedIndex(tagSkills)]
    }
    const upSkillCost = getUpSkillCost(skills[skillId])
    const maxSkillScore = getMaxSkillScore(level)
    if (upSkillCost > remainingSkillPoints || maxSkillScore === skills[skillId]) break
    skills[skillId] += upSkillCost
    remainingSkillPoints -= upSkillCost
  }
  return skills
}

// export const getEquipedObjects = (
//   level: number,
//   calcTagSkills: SkillId[],
//   { weaponTags }: HumanTemplate
// ): DbEquipedObjects => {
//   const equipedObjects = {} as DbEquipedObjects
//   const tierAccess = Math.max(1, Math.round(level / 2.5))
//   const skillsWithWeapons = ["melee", "smallGuns", "bigGuns", "unarmed"]
//   const firstMartialSkill = calcTagSkills.find(s => skillsWithWeapons.includes(s))
//   if (firstMartialSkill) {
//     const tags = weaponTags ?? []
//     const weapons = Object.values(weaponsMap)
//       .filter(w => calcTagSkills.includes(w.skill))
//       .filter(w => 6 - w.frequency <= tierAccess)
//       .filter(w => w.tags.some(t => tags.includes(t)))

//     const weapon = weapons[getRandomArbitrary(0, weapons.length - 1)] ?? { id: "unarmed" }
//     const inMagazine = weapon?.magazine ?? undefined
//     const dbWeapon = inMagazine ? { id: weapon.id, inMagazine } : { id: weapon.id }
//     equipedObjects.weapons = { main: dbWeapon }
//   }

//   const clothings = Object.values(clothingsMap)
//     .filter(c => c.tier <= tierAccess)
//     .filter(c => c.protects.includes("torso"))
//   const clothing = clothings[getRandomArbitrary(0, clothings.length - 1)]
//   if (clothing) {
//     equipedObjects.clothings = { main: { id: clothing.id } }
//   }
//   return equipedObjects
// }
export const getEquipedObjects = (): DbEquipedObjects =>
  ({ weapons: {}, clothings: {} } as DbEquipedObjects)

export const getStatus = (level: number, special: Special, background?: BackgroundId): DbStatus => {
  // const currAp = secAttrMap.actionPoints.calc(special)
  const exp = getExpForLevel(level)
  const rads = 0
  return {
    background: background ?? "other",
    // currAp,
    exp,
    level,
    rads,
    ...limbsDefault
  }
}

export const generateDbHuman = (
  level: number,
  template: keyof typeof humanTemplates
): Omit<DbChar, "meta"> => {
  const baseSPECIAL = getSpecialFromTemplate(template)
  const traits = getTraitsFromTemplate(template)
  const tagSkills = getTagSkillsFromTemplate(level, template)
  const upSkills = getUpSkillsScores(level, tagSkills, baseSPECIAL, traits)
  // const equipedObj = getEquipedObjects(level, tagSkills, humanTemplates[template])
  const equipedObj = getEquipedObjects()
  const status = getStatus(level, baseSPECIAL)
  const combatStatus = { currAp: 0 }
  return {
    abilities: {
      baseSPECIAL,
      upSkills,
      traits,
      knowledges: {} as Record<KnowledgeId, KnowledgeLevelValue>
    },
    combatStatus,
    inventory: {} as DbInventory,
    equipedObj,
    status
  }
}
