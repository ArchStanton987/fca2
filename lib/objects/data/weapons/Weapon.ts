import Abilities from "lib/character/abilities/Abilities"
import { KnowledgeId } from "lib/character/abilities/knowledges/knowledge-types"
import knowledgeLevels from "lib/character/abilities/knowledges/knowledges-levels"
import perksMap from "lib/character/abilities/perks/perks"
import { PerkId } from "lib/character/abilities/perks/perks.types"
import traitsMap from "lib/character/abilities/traits/traits"
import { TraitId } from "lib/character/abilities/traits/traits.types"
import { TemplateId } from "lib/character/info/CharInfo"
import { getModAttribute } from "lib/common/utils/char-calc"
import { critters } from "lib/npc/const/npc-templates"

import { AmmoSet } from "../ammo/ammo.types"
import { DbWeapon, ItemInterface } from "../objects.types"
import weaponsMap from "./weapons"
import {
  HIT_WITH_AP_COST,
  LOAD_AP_COST,
  MALUS_PER_MISSING_STRENGTH,
  THROW_AP_COST,
  UNLOAD_AP_COST
} from "./weapons-const"
import { DbWeaponData, WeaponActionId, WeaponData, WeaponId, WeaponTagId } from "./weapons.types"

export default class Weapon implements ItemInterface {
  id: WeaponId
  dbKey: string
  category: "weapons"
  isEquipped: boolean
  inMagazine: number | null
  data: WeaponData

  static dbToData = (payload: Partial<DbWeaponData>): Partial<WeaponData> => {
    const result = {
      ...payload,
      knowledges: payload.knowledges
        ? (Object.keys(payload.knowledges ?? {}) as KnowledgeId[])
        : undefined,
      tags: payload.tags ? (Object.keys(payload.tags ?? {}) as WeaponTagId[]) : undefined
    }
    if (result.knowledges === undefined) delete result.knowledges
    if (result.tags === undefined) delete result.tags
    return result
  }

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
    new Weapon({ id: "unarmed", category: "weapons", key: "unarmed", isEquipped: true })

  constructor(
    payload: DbWeapon & { key: string },
    allWeapons: Record<string, WeaponData> = weaponsMap
  ) {
    this.id = payload.id
    this.dbKey = payload.key
    this.category = payload.category
    this.isEquipped = payload.isEquipped
    this.data = { ...allWeapons[this.id], ...Weapon.dbToData(payload.data ?? {}) }
    const { inMagazine = 0 } = payload
    this.inMagazine = this.data.ammoType !== null ? inMagazine : null
  }

  getSkillScore(abilities: Abilities, charInfo: { isCritter: boolean; templateId: TemplateId }) {
    if (charInfo.isCritter && charInfo.templateId in critters) {
      const template = critters[charInfo.templateId]
      const attack = template.attacks.find(a => a.name === this.id)
      if (!attack)
        throw new Error(`Could not find attack with name : ${this.id} for : ${charInfo.templateId}`)
      return attack.skill
    }

    const { isTwoHanded, minStrength } = this.data
    const baseScore = abilities.skills.curr[this.data.skillId]

    const weaponKnowledges = this.data.knowledges ?? []
    const { knowledges, traits, special } = abilities
    const { strength } = special.curr
    const traitsArray = Object.keys(abilities.traits ?? {})
    const perksArray = Object.keys(abilities.perks ?? {})
    const traitsSymptoms = traitsArray.map(t => traitsMap[t as TraitId]?.symptoms ?? [])
    const perksSymptoms = perksArray.map(t => perksMap[t as PerkId]?.symptoms ?? [])
    const innateSymptoms = [...traitsSymptoms, ...perksSymptoms].flat()

    const knowledgesBonus = weaponKnowledges.reduce((acc, curr: KnowledgeId) => {
      const knowledgeLevel = knowledges[curr]
      const knowledgeBonus = knowledgeLevels.find(el => el.id === knowledgeLevel)?.bonus || 0
      const innateBonus = getModAttribute(innateSymptoms, curr)
      return acc + knowledgeBonus + innateBonus
    }, 0)

    let charTraitSkillModifier = 0
    if (traits.lateralized) {
      const { TWO_HANDED_WEAPONS_MOD, ONE_HANDED_WEAPONS_MOD } = traitsMap.lateralized.consts
      charTraitSkillModifier = isTwoHanded ? TWO_HANDED_WEAPONS_MOD : ONE_HANDED_WEAPONS_MOD
    }
    const strengthMalus = Math.max(0, minStrength - strength) * MALUS_PER_MISSING_STRENGTH
    return baseScore + knowledgesBonus + charTraitSkillModifier - strengthMalus
  }

  getApCost(
    abilities: { traits: Abilities["traits"]; secAttr: Abilities["secAttr"] },
    actionType: WeaponActionId,
    charInfo: { isCritter: boolean; templateId: TemplateId }
  ) {
    if (charInfo.isCritter && charInfo.templateId in critters) {
      const template = critters[charInfo.templateId]
      const attack = template.attacks.find(a => a.name === this.id)
      if (!attack)
        throw new Error(`Could not find attack with name : ${this.id}for : ${charInfo.templateId}`)
      return attack.apCost
    }
    const { secAttr, traits } = abilities
    const apCosts = {
      basic: this.data.basicApCost,
      aim: this.data.specialApCost,
      burst: secAttr.base.actionPoints,
      reload: LOAD_AP_COST,
      unload: UNLOAD_AP_COST,
      throw: THROW_AP_COST,
      hit: HIT_WITH_AP_COST
    }
    if (this.data.skillId === "trap") {
      apCosts.basic = abilities.secAttr.base.actionPoints
    }
    if (traits.mrFast) {
      const { BASIC_AP_COST_MOD, SPECIAL_AP_COST_VALUE } = traitsMap.mrFast.consts
      apCosts.basic =
        typeof apCosts.basic === "number" ? apCosts.basic + BASIC_AP_COST_MOD : apCosts.basic
      apCosts.aim = SPECIAL_AP_COST_VALUE
    }
    return apCosts[actionType]
  }

  getAmmoCount(ammo: Partial<AmmoSet>) {
    return this.data.ammoType ? ammo[this.data.ammoType] : null
  }

  getDamageEst(secAttr: Abilities["secAttr"]) {
    return Weapon.getDamageEst(secAttr, this)
  }

  // getAttacks() {}
  // getActions() {}
}
