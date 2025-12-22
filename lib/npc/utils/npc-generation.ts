import { defaultNullSkillsValues } from "lib/character/abilities/skills/skills"
import { SkillId } from "lib/character/abilities/skills/skills.types"
import { getUpSkillCost } from "lib/character/abilities/skills/utils/skills-utils"
import { Special } from "lib/character/abilities/special/special.types"
import { TraitId } from "lib/character/abilities/traits/traits.types"
import Health, { DbHealth } from "lib/character/health/Health"
import { DbCharInfo, TemplateId } from "lib/character/info/CharInfo"
import { getInitSkillsPoints, getSkillPointsPerLevel } from "lib/character/progress/progress-utils"
import { getLevelAndThresholds } from "lib/character/status/status-calc"
import { getRandomArbitrary } from "lib/common/utils/dice-calc"
import { getRandomWeightedIndex } from "lib/shared/utils/math-utils"

import humanTemplates from "../const/human-templates"
import { critters } from "../const/npc-templates"
import { CreateNpcForm } from "../create-npc-store"

export const formToDbCharInfo = (payload: CreateNpcForm, squadId: string): DbCharInfo => ({
  speciesId: payload.speciesId,
  templateId: payload.templateId,
  background: "other",
  firstname: payload.firstname,
  lastname: payload.lastname,
  description: payload.description,
  isNpc: true,
  isEnemy: payload.isEnemy,
  isCritter: payload.speciesId === "beast" || payload.speciesId === "robot",
  squadId
})

export const getSpecialFromTemplate = (templateId: TemplateId) => {
  if (templateId === "player") throw new Error("missing player SPECIAL")
  if (templateId in critters) return critters[templateId].special
  const { special } = humanTemplates[templateId]
  return {
    strength: getRandomArbitrary(special.strength.min, special.strength.max),
    perception: getRandomArbitrary(special.perception.min, special.perception.max),
    endurance: getRandomArbitrary(special.endurance.min, special.endurance.max),
    charisma: getRandomArbitrary(special.charisma.min, special.charisma.max),
    intelligence: getRandomArbitrary(special.intelligence.min, special.intelligence.max),
    agility: getRandomArbitrary(special.agility.min, special.agility.max),
    luck: getRandomArbitrary(special.luck.min, special.luck.max)
  }
}

export const getTraitsFromTemplate = (templateId: TemplateId) => {
  if (!(templateId in humanTemplates)) return []
  const { traits } = humanTemplates[templateId]
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

export const getTagSkillsFromTemplate = (level: number, templateId: TemplateId) => {
  if (!(templateId in humanTemplates)) return []
  const maxCount = getMaxTagSkills(level)
  const { tagSkills, mandatorySkills } = humanTemplates[templateId]
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
  const skills = { ...defaultNullSkillsValues }
  while (remainingSkillPoints > 0) {
    const isRandomSkill = getRandomArbitrary(0, 101) < 0.1 * 100
    let skillId
    if (isRandomSkill) {
      const randomSkillIndex = getRandomArbitrary(0, Object.keys(defaultNullSkillsValues).length)
      skillId = Object.keys(skills)[randomSkillIndex] as SkillId
    } else {
      skillId = tagSkills[getRandomWeightedIndex(tagSkills)]
    }
    if (!(skillId in skills)) break
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

export const getDbHealth = (
  exp: number,
  baseSPECIAL: Special,
  templateId: TemplateId
): DbHealth => {
  const { level } = getLevelAndThresholds(exp)
  return {
    rads: 0,
    currHp: Health.getMaxHp({ baseSPECIAL, exp, templateId }),
    limbs: Health.initLimbs(templateId, level)
  }
}
