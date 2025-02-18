/* eslint-disable import/prefer-default-export */
import { DbAbilities } from "lib/character/abilities/abilities.types"
import { KnowledgeId } from "lib/character/abilities/knowledges/knowledge-types"
import knowledgeLevels from "lib/character/abilities/knowledges/knowledges-levels"
import { SkillsValues } from "lib/character/abilities/skills/skills.types"
import { Special } from "lib/character/abilities/special/special.types"
import traitsMap from "lib/character/abilities/traits/traits"
import { Symptom } from "lib/character/effects/symptoms.type"
import { getModAttribute } from "lib/common/utils/char-calc"

import { DbEquipedObjects, DbInventory } from "../objects.types"
import weaponsMap from "./weapons"
import { MALUS_PER_MISSING_STRENGTH } from "./weapons-const"
import { DbWeapon, Weapon } from "./weapons.types"

export const dbToWeapon = (
  [dbKey, dbWeapon]: [string, DbWeapon],
  charData: {
    dbAbilities: DbAbilities
    innateSymptoms: Symptom[]
    currSkills: SkillsValues
    currSpecial: Special
    dbEquipedObjects: DbEquipedObjects
  },
  dbAmmo: DbInventory["ammo"]
): Weapon => {
  const { id } = dbWeapon
  const weaponSkill = weaponsMap[id].skill
  const weaponKnowledges = weaponsMap[id].knowledges
  const { ammoType, minStrength, isTwoHanded } = weaponsMap[id]
  const inMagazine = ammoType !== null ? dbWeapon.inMagazine || 0 : undefined
  let ammo = 0
  if (ammoType && dbAmmo) {
    ammo = dbAmmo[ammoType] ?? 0
  }
  const { innateSymptoms, currSkills, dbAbilities, dbEquipedObjects, currSpecial } = charData
  const { knowledges, traits } = dbAbilities
  const knowledgesBonus = weaponKnowledges.reduce((acc, curr: KnowledgeId) => {
    const knowledgeLevel = knowledges[curr]
    const knowledgeBonus = knowledgeLevels.find(el => el.id === knowledgeLevel)?.bonus || 0
    const innateBonus = getModAttribute(innateSymptoms, curr)
    return acc + knowledgeBonus + innateBonus
  }, 0)
  let charTraitSKillModifier = 0
  if (traits?.includes("lateralized")) {
    const { TWO_HANDED_WEAPONS_MOD, ONE_HANDED_WEAPONS_MOD } = traitsMap.lateralized.consts
    charTraitSKillModifier = isTwoHanded ? TWO_HANDED_WEAPONS_MOD : ONE_HANDED_WEAPONS_MOD
  }
  const strengthMalus = Math.max(0, minStrength - currSpecial.strength) * MALUS_PER_MISSING_STRENGTH
  const skill = currSkills[weaponSkill] + knowledgesBonus + charTraitSKillModifier - strengthMalus
  let { basicApCost, specialApCost } = weaponsMap[id]
  if (traits?.includes("mrFast")) {
    const { BASIC_AP_COST_MOD, SPECIAL_AP_COST_VALUE } = traitsMap.mrFast.consts
    specialApCost = SPECIAL_AP_COST_VALUE
    basicApCost = basicApCost !== null ? basicApCost + BASIC_AP_COST_MOD : null
  }
  const isEquiped = dbEquipedObjects?.weapons?.[dbKey] !== undefined
  const data = { ...weaponsMap[id], basicApCost, specialApCost }
  return { inMagazine, data, dbKey, id, skill, isEquiped, ammo }
}
