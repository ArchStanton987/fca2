import Abilities from "lib/character/abilities/Abilities"
import { KnowledgeId } from "lib/character/abilities/knowledges/knowledge-types"
import knowledgeLevels from "lib/character/abilities/knowledges/knowledges-levels"
import perksMap from "lib/character/abilities/perks/perks"
import { PerkId } from "lib/character/abilities/perks/perks.types"
import traitsMap from "lib/character/abilities/traits/traits"
import { TraitId } from "lib/character/abilities/traits/traits.types"
import { getModAttribute } from "lib/common/utils/char-calc"

import { AmmoSet } from "../ammo/ammo.types"
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

  static getDamageEst(secAttr: Abilities["secAttr"], weapon: Weapon) {
    const { damageBasic, damageBurst } = weapon.data
    if (!damageBasic && !damageBurst) return 0
    const refDamage = (damageBurst || damageBasic) as string
    const sections = refDamage.split("+")
    const sum = sections.reduce((acc, section) => {
      if (section === "DM") return acc + secAttr.curr.meleeDamage
      if (section.includes("D")) {
        const [nDices, faces] = section.split("D").map(Number)
        return acc + nDices * (faces / 2)
      }
      return acc + Number(section)
    }, 0)
    return sum
  }

  static getUnarmed = () =>
    new Weapon({ id: "unarmed", category: "weapons", dbKey: "unarmed", isEquipped: true }, {})

  constructor(payload: DbWeapon, allWeapons: Record<string, WeaponData>) {
    this.id = payload.id
    this.dbKey = payload.dbKey
    this.category = payload.category
    this.isEquipped = payload.isEquipped
    this.data = { ...allWeapons[this.id], ...Weapon.dbToData(payload.data ?? {}) }
    const { inMagazine = 0 } = payload
    this.inMagazine = this.data.ammoType !== null ? inMagazine : null
  }

  getSkillScore(abilities: Abilities) {
    const { isTwoHanded, minStrength } = this.data
    const baseScore = abilities.skills.curr[this.data.skillId]

    const weaponKnowledges = this.data.knowledges
    const { knowledges, traits, special } = abilities
    const { strength } = special.curr
    const traitsArray = Object.keys(abilities.traits ?? {})
    const perksArray = Object.keys(abilities.perks ?? {})
    const traitsSymptoms = traitsArray.map(t => traitsMap[t as TraitId].symptoms)
    const perksSymptoms = perksArray.map(t => perksMap[t as PerkId].symptoms)
    const innateSymptoms = [...traitsSymptoms, ...perksSymptoms].flat()

    const knowledgesBonus = weaponKnowledges.reduce((acc, curr: KnowledgeId) => {
      const knowledgeLevel = knowledges[curr]
      const knowledgeBonus = knowledgeLevels.find(el => el.id === knowledgeLevel)?.bonus || 0
      const innateBonus = getModAttribute(innateSymptoms, curr)
      return acc + knowledgeBonus + innateBonus
    }, 0)

    let charTraitSKillModifier = 0
    if (traits.lateralized) {
      const { TWO_HANDED_WEAPONS_MOD, ONE_HANDED_WEAPONS_MOD } = traitsMap.lateralized.consts
      charTraitSKillModifier = isTwoHanded ? TWO_HANDED_WEAPONS_MOD : ONE_HANDED_WEAPONS_MOD
    }
    const strengthMalus = Math.max(0, minStrength - strength) * MALUS_PER_MISSING_STRENGTH
    return baseScore + knowledgesBonus + charTraitSKillModifier - strengthMalus
  }

  getApCost(traits: Abilities["traits"]) {
    let { basicApCost, specialApCost } = this.data
    if (traits.mrFast) {
      const { BASIC_AP_COST_MOD, SPECIAL_AP_COST_VALUE } = traitsMap.mrFast.consts
      specialApCost = SPECIAL_AP_COST_VALUE
      basicApCost = basicApCost !== null ? basicApCost + BASIC_AP_COST_MOD : null
    }
    return { basicApCost, specialApCost }
  }

  getAmmoCount(ammo: AmmoSet) {
    return this.data.ammoType ? ammo[this.data.ammoType] : null
  }

  getDamageEst(secAttr: Abilities["secAttr"]) {
    return Weapon.getDamageEst(secAttr, this)
  }

  // getAttacks() {}
  // getActions() {}
}
