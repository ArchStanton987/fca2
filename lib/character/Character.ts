import { computed, makeObservable, observable } from "mobx"

import { getModAttribute } from "../common/utils/char-calc"
import { AmmoType } from "../objects/ammo/ammo.types"
import clothingsMap from "../objects/clothings/clothings"
import { ClothingId } from "../objects/clothings/clothings.types"
import { ConsumableId } from "../objects/consumables/consumables.types"
import { MiscObjectId } from "../objects/misc-objects/misc-objects-types"
import weaponsMap from "../objects/weapons/weapons"
import { WeaponId } from "../objects/weapons/weapons.types"
import { KnowledgeId, KnowledgeLevelValue } from "./abilities/knowledges/knowledge-types"
import perksMap from "./abilities/perks/perks"
import { PerkId } from "./abilities/perks/perks.types"
import secAttrMap from "./abilities/sec-attr/sec-attr"
import { SecAttrsValues } from "./abilities/sec-attr/sec-attr-types"
import skillsMap from "./abilities/skills/skills"
import { SkillsValues } from "./abilities/skills/skills.types"
import { Special } from "./abilities/special/special.types"
import traitsMap from "./abilities/traits/traits"
import { TraitId } from "./abilities/traits/traits.types"
import effectsMap from "./effects/effects"
import { EffectId } from "./effects/effects.types"
import { Symptom } from "./effects/symptoms.type"
import { LimbHpId, healthStates, limbsMap, radStates } from "./health/health"
import { getMaxHP, getMissingHp } from "./health/health-calc"
import { Health } from "./health/health-types"

type DbAbilities = {
  baseSPECIAL: Special
  traits?: TraitId[]
  perks?: PerkId[]
  knowledges: Record<KnowledgeId, KnowledgeLevelValue>
  upSkills: SkillsValues
}
type DbConsumable = { id: ConsumableId; remainingUse?: number }
type DbEffect = { id: EffectId; startTs: number; endTs?: number }
type DbClothing = { id: ClothingId }
type DbWeapon = { id: WeaponId }
type DbEquipedObjects = {
  clothings?: Record<string, DbClothing>
  weapons?: Record<string, DbWeapon>
}
type DbMiscObject = { id: MiscObjectId }
type DbInventory = {
  ammo?: Record<AmmoType, number>
  clothings?: Record<string, DbClothing>
  consumables?: Record<string, DbConsumable>
  weapons?: Record<string, DbWeapon>
  objects?: Record<string, DbMiscObject>
}
export type DbLimbsHp = {
  headHp: number
  leftArmHp: number
  leftTorsoHp: number
  rightTorsoHp: number
  rightArmHp: number
  leftLegHp: number
  groinHp: number
  rightLegHp: number
}

type DbStatus = {
  background: string
  caps: number
  currAp: number
  exp: number
  level: number
  poison: number
  rads: number
} & DbLimbsHp

export type DbChar = {
  abilities: DbAbilities
  effects?: Record<string, DbEffect>
  equipedObjects?: DbEquipedObjects
  inventory?: DbInventory
  status: DbStatus
}

export default class Character {
  dbAbilities: DbAbilities
  dbEffects: Record<string, DbEffect>
  equipedObjects: DbEquipedObjects
  inventory: DbInventory
  status: DbStatus

  constructor(obj: DbChar) {
    this.dbAbilities = obj.abilities
    this.dbEffects = obj.effects || {}
    this.equipedObjects = obj.equipedObjects || {}
    this.inventory = obj.inventory || {}
    this.status = obj.status

    makeObservable(this, {
      dbAbilities: observable,
      dbEffects: observable,
      equipedObjects: observable,
      inventory: observable,
      status: observable,
      //
      innateSymptoms: computed,
      baseSpecial: computed,
      baseSecAttr: computed,
      baseSkills: computed,
      //
      health: computed,
      //
      effects: computed,
      symptoms: computed,
      //
      modSpecial: computed,
      modSecAttr: computed,
      modSkills: computed,
      //
      currSpecial: computed,
      currSecAttr: computed,
      currSkills: computed,
      //
      special: computed,
      secAttr: computed,
      skills: computed,
      knowledges: computed,
      //
      weapons: computed,
      clothings: computed,
      consumables: computed,
      ammo: computed,
      miscObjects: computed
    })
  }

  get innateSymptoms() {
    const traitsSymptoms = this.dbAbilities?.traits?.map(el => traitsMap[el].symptoms) || []
    const perksSymptoms = this.dbAbilities?.perks?.map(el => perksMap[el].symptoms) || []
    return [...traitsSymptoms, ...perksSymptoms].flat()
  }

  get baseSpecial() {
    const result = {} as Special
    const specialKeys = Object.keys(this.dbAbilities.baseSPECIAL) as (keyof Special)[]
    const { baseSPECIAL } = this.dbAbilities
    specialKeys.forEach(key => {
      result[key] = baseSPECIAL[key] + getModAttribute(this.innateSymptoms, key)
    })
    return result
  }

  get baseSecAttr() {
    const result = {} as SecAttrsValues
    const secAttrKeys = Object.keys(secAttrMap) as (keyof SecAttrsValues)[]
    secAttrKeys.forEach(key => {
      result[key] =
        secAttrMap[key].calc(this.baseSpecial) + getModAttribute(this.innateSymptoms, key)
    })
    return result
  }

  get baseSkills() {
    const result = {} as SkillsValues
    const skillsKeys = Object.keys(skillsMap) as (keyof SkillsValues)[]
    skillsKeys.forEach(key => {
      result[key] =
        skillsMap[key].calc(this.baseSpecial) + getModAttribute(this.innateSymptoms, key)
    })
    return result
  }

  get health(): Health {
    const maxHp = getMaxHP(this.baseSpecial, this.status.exp)
    const missingHp = getMissingHp(this.status)
    const currHp = maxHp - missingHp
    return {
      maxHp,
      missingHp,
      hp: currHp,
      poison: this.status.poison,
      rads: this.status.rads,
      limbsHp: {
        headHp: this.status.headHp,
        leftTorsoHp: this.status.leftTorsoHp,
        rightTorsoHp: this.status.rightTorsoHp,
        leftArmHp: this.status.leftArmHp,
        rightArmHp: this.status.rightArmHp,
        leftLegHp: this.status.leftLegHp,
        rightLegHp: this.status.rightLegHp,
        groinHp: this.status.groinHp
      }
    }
  }

  get effects(): Array<EffectId> {
    // get all calculated effects
    // hp effects
    const { hp, maxHp } = this.health
    const currHpPercent = (hp / maxHp) * 100
    const healthState = healthStates.find(el => currHpPercent < el.min)
    const hpEffectsIds = healthState ? [healthState.id] : []
    // cripled effects
    const { limbsHp } = this.health
    const noHpLimbs = Object.keys(limbsHp).filter(el => limbsHp[el as LimbHpId] === 0)
    const cripledEffectsIds = noHpLimbs.map(el => limbsMap[el as LimbHpId].cripledEffect)
    // rads effects
    const { rads } = this.health
    const radsState = radStates.find(el => rads > el.threshold)
    const radsEffectsIds = radsState ? [radsState.id] : []
    // get all db stored effects
    const effectsIds = Object.values(this.dbEffects).map(el => el.id)
    // merge all effects
    return [...effectsIds, ...hpEffectsIds, ...cripledEffectsIds, ...radsEffectsIds]
  }

  get symptoms(): Symptom[] {
    const clothingsIds = Object.values(this.inventory.clothings || []).map(el => el.id)
    const clothingsSymptoms = clothingsIds.map(el => clothingsMap[el].symptoms)
    const effectsSymptoms = this.effects.map(el => effectsMap[el].symptoms)
    return [...effectsSymptoms, ...clothingsSymptoms].flat()
  }

  get modSpecial() {
    const result = {} as Special
    const specialKeys = Object.keys(this.baseSpecial) as (keyof Special)[]
    specialKeys.forEach(key => {
      result[key] = this.baseSpecial[key] + getModAttribute(this.symptoms, key)
    })
    return result
  }

  get modSecAttr() {
    const result = {} as SecAttrsValues
    const secAttrKeys = Object.keys(this.baseSecAttr) as (keyof SecAttrsValues)[]
    secAttrKeys.forEach(key => {
      result[key] = this.baseSecAttr[key] + getModAttribute(this.symptoms, key)
    })
    return result
  }

  get modSkills() {
    const result = {} as SkillsValues
    const skillsKeys = Object.keys(this.baseSkills) as (keyof SkillsValues)[]
    skillsKeys.forEach(key => {
      result[key] = this.baseSkills[key] + getModAttribute(this.symptoms, key)
    })
    return result
  }

  get currSpecial() {
    const result = {} as Special
    const specialKeys = Object.keys(this.modSpecial) as (keyof Special)[]
    specialKeys.forEach(key => {
      result[key] = this.modSpecial[key]
    })
    return result
  }

  get currSecAttr() {
    const result = {} as SecAttrsValues
    const secAttrKeys = Object.keys(this.modSecAttr) as (keyof SecAttrsValues)[]
    secAttrKeys.forEach(key => {
      result[key] = this.modSecAttr[key]
    })
    return result
  }

  get currSkills() {
    const result = {} as SkillsValues
    const skillsKeys = Object.keys(this.modSkills) as (keyof SkillsValues)[]
    skillsKeys.forEach(key => {
      result[key] = this.modSkills[key]
    })
    return result
  }

  get special() {
    return { base: this.baseSpecial, mod: this.modSpecial, curr: this.currSpecial }
  }

  get secAttr() {
    return { base: this.baseSecAttr, mod: this.modSecAttr, curr: this.currSecAttr }
  }

  get skills() {
    return {
      base: this.baseSkills,
      up: this.dbAbilities.upSkills,
      mod: this.modSkills,
      curr: this.currSkills
    }
  }

  get knowledges() {
    return Object.entries(this.dbAbilities.knowledges)
      .map(([id, value]) => ({ id: id as KnowledgeId, value }))
      .sort((a, b) => b.value - a.value)
  }

  get weapons() {
    return Object.entries(this.inventory.weapons || []).map(([key, value]) => {
      const weaponSkill = weaponsMap[value.id].skill
      const weaponKnowledges = weaponsMap[value.id].knowledges
      const { knowledges } = this.dbAbilities
      const knowledgesBonus = weaponKnowledges.reduce(
        (acc, curr: KnowledgeId) =>
          acc + (knowledges[curr] ?? 0) + getModAttribute(this.innateSymptoms, curr),
        0
      )
      const skillScore = this.currSkills[weaponSkill] + knowledgesBonus
      const hasMrFast = this.dbAbilities.traits?.includes("mrFast")
      let apCost = weaponsMap[value.id].basicApCost
      if (apCost !== null) {
        apCost = hasMrFast ? apCost - 1 : apCost
      }
      const isEquiped = this.equipedObjects?.weapons?.[key] !== undefined
      return { dbKey: key, id: value.id, skill: skillScore, basicApCost: apCost, isEquiped }
    })
  }

  get clothings() {
    return Object.entries(this.inventory.clothings || []).map(([key, value]) => {
      const isEquiped = this.equipedObjects?.clothings?.[key] !== undefined
      return { dbKey: key, id: value.id, isEquiped }
    })
  }

  get consumables() {
    return Object.entries(this.inventory.consumables || []).map(([key, value]) => ({
      dbKey: key,
      id: value.id,
      remainingUse: value.remainingUse
    }))
  }

  get miscObjects() {
    return Object.entries(this.inventory.objects || {}).map(([key, value]) => ({
      dbKey: key,
      id: value.id
    }))
  }

  get ammo() {
    return (
      Object.entries(this.inventory.ammo || {})
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .filter(([_, amount]) => amount > 0)
        .map(([id, amount]) => ({ id: id as AmmoType, amount }))
        .sort((a, b) => b.amount - a.amount)
    )
  }
}
