import Playable from "lib/character/Playable"
import { KnowledgeId } from "lib/character/abilities/knowledges/knowledge-types"
import knowledgeLevels from "lib/character/abilities/knowledges/knowledges-levels"
import traitsMap from "lib/character/abilities/traits/traits"
import { getModAttribute } from "lib/common/utils/char-calc"

import { DbWeapon, ItemInterface } from "../objects.types"
import { MALUS_PER_MISSING_STRENGTH } from "./weapons-const"
import { DbWeaponData, WeaponData, WeaponId, WeaponTagId } from "./weapons.types"

export default class Weapon implements ItemInterface {
  id: WeaponId
  dbKey: string
  category: "weapons"
  isEquipped: boolean
  inMagazine: number | null
  data: WeaponData

  static dbToData = (payload: Partial<DbWeaponData>): Partial<WeaponData> => ({
    ...payload,
    damageBasic: payload.damageBasic ?? null,
    damageBurst: payload.damageBurst ?? null,
    ammoType: payload.ammoType ?? null,
    range: payload.range ?? null,
    magazine: payload.magazine ?? null,
    ammoPerShot: payload.ammoPerShot ?? null,
    ammoPerBurst: payload.ammoPerBurst ?? null,
    basicApCost: payload.basicApCost ?? null,
    specialApCost: payload.specialApCost ?? null,
    knowledges: Object.keys(payload.knowledges ?? {}) as KnowledgeId[],
    tags: Object.keys(payload.tags ?? {}) as WeaponTagId[]
  })

  constructor(payload: DbWeapon, allWeapons: Record<string, WeaponData>) {
    this.id = payload.id
    this.dbKey = payload.dbKey
    this.category = payload.category
    this.isEquipped = payload.isEquipped
    this.data = { ...allWeapons[this.id], ...Weapon.dbToData(payload.data ?? {}) }
    const { inMagazine = 0 } = payload
    this.inMagazine = this.data.ammoType !== null ? inMagazine : null
  }

  getSkillScore(char: Playable) {
    const { isTwoHanded, minStrength } = this.data
    const baseScore = char.skills.curr[this.data.skillId]

    const weaponKnowledges = this.data.knowledges
    const { innateSymptoms, knowledgesRecord, traits, special } = char
    const { strength } = special.curr

    const knowledgesBonus = weaponKnowledges.reduce((acc, curr: KnowledgeId) => {
      const knowledgeLevel = knowledgesRecord[curr]
      const knowledgeBonus = knowledgeLevels.find(el => el.id === knowledgeLevel)?.bonus || 0
      const innateBonus = getModAttribute(innateSymptoms, curr)
      return acc + knowledgeBonus + innateBonus
    }, 0)

    let charTraitSKillModifier = 0
    if (traits?.find(t => t.id === "lateralized")) {
      const { TWO_HANDED_WEAPONS_MOD, ONE_HANDED_WEAPONS_MOD } = traitsMap.lateralized.consts
      charTraitSKillModifier = isTwoHanded ? TWO_HANDED_WEAPONS_MOD : ONE_HANDED_WEAPONS_MOD
    }
    const strengthMalus = Math.max(0, minStrength - strength) * MALUS_PER_MISSING_STRENGTH
    return baseScore + knowledgesBonus + charTraitSKillModifier - strengthMalus
  }

  getApCost({ traits }: Playable) {
    let { basicApCost, specialApCost } = this.data
    if (traits?.find(t => t.id === "mrFast")) {
      const { BASIC_AP_COST_MOD, SPECIAL_AP_COST_VALUE } = traitsMap.mrFast.consts
      specialApCost = SPECIAL_AP_COST_VALUE
      basicApCost = basicApCost !== null ? basicApCost + BASIC_AP_COST_MOD : null
    }
    return { basicApCost, specialApCost }
  }

  // getAttacks() {}
  // getActions() {}
}
