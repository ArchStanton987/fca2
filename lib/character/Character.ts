import { getRemainingTime } from "lib/common/utils/time-calc"
import { DbEquipedObjects, DbInventory } from "lib/objects/objects.types"
import weaponsMap from "lib/objects/weapons/weapons"
import { computed, makeObservable, observable } from "mobx"

import { getModAttribute } from "../common/utils/char-calc"
import clothingsMap from "../objects/clothings/clothings"
import { DbAbilities } from "./abilities/abilities.types"
import { KnowledgeId } from "./abilities/knowledges/knowledge-types"
import perksMap from "./abilities/perks/perks"
import secAttrMap from "./abilities/sec-attr/sec-attr"
import { SecAttrsValues } from "./abilities/sec-attr/sec-attr-types"
import skillsMap from "./abilities/skills/skills"
import { SkillsValues } from "./abilities/skills/skills.types"
import { Special } from "./abilities/special/special.types"
import traitsMap from "./abilities/traits/traits"
import effectsMap from "./effects/effects"
import { DbEffect, Effect, EffectData, EffectId } from "./effects/effects.types"
import { Symptom } from "./effects/symptoms.type"
import { LimbHpId, healthStates, limbsMap, radStates } from "./health/health"
import { getMaxHP, getMissingHp } from "./health/health-calc"
import { Health } from "./health/health-types"
import { DbStatus } from "./status/status.types"

export type DbChar = {
  abilities: DbAbilities
  effects?: Record<string, DbEffect>
  equipedObj?: DbEquipedObjects
  inventory?: DbInventory
  status: DbStatus
}

export default class Character {
  dbAbilities: DbAbilities
  dbEffects: Record<string, DbEffect>
  dbEquipedObjects: DbEquipedObjects
  dbInventory: DbInventory
  status: DbStatus
  date: Date

  constructor(obj: DbChar, date: Date) {
    this.dbAbilities = obj.abilities
    this.dbEffects = obj.effects || {}
    this.dbEquipedObjects = obj.equipedObj || {}
    this.dbInventory = obj.inventory || {}
    this.status = obj.status
    this.date = date

    makeObservable(this, {
      dbAbilities: observable,
      dbEffects: observable,
      dbEquipedObjects: observable,
      dbInventory: observable,
      status: observable,
      date: observable,
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
      equipedObjects: computed
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

  get effects(): Effect[] {
    // get all calculated effects
    // hp effects
    const { hp, maxHp } = this.health
    const currHpPercent = (hp / maxHp) * 100
    const healthState = healthStates.find(el => currHpPercent < el.min)
    const hpEffects = healthState ? [{ id: healthState.id, data: effectsMap[healthState.id] }] : []
    // cripled effects
    const { limbsHp } = this.health
    const noHpLimbs = Object.keys(limbsHp).filter(el => limbsHp[el as LimbHpId] === 0)
    const cripledEffects = noHpLimbs.map(el => ({
      id: limbsMap[el as LimbHpId].cripledEffect,
      data: effectsMap[limbsMap[el as LimbHpId].cripledEffect]
    }))
    // rads effects
    const { rads } = this.health
    const radsState = radStates.find(el => rads > el.threshold)
    const radsEffects = radsState ? [{ id: radsState.id, data: effectsMap[radsState.id] }] : []
    // get all calculated effects objects
    const calculatedEffects = [...hpEffects, ...cripledEffects, ...radsEffects]

    // get all db stored effects
    const effectsIds = Object.entries(this.dbEffects).map(([dbKey, value]) => {
      let timeRemaining = null
      const { length } = effectsMap[value.id]
      if (value.endTs) {
        timeRemaining = getRemainingTime(this.date.getTime(), value.endTs)
      }
      if (value.startTs && length) {
        const lengthInMs = length * 3600000
        const end = value.startTs * 1000 + lengthInMs
        timeRemaining = getRemainingTime(this.date.getTime(), end)
      }
      return { timeRemaining, dbKey, data: effectsMap[value.id], ...value }
    })
    // merge all effects
    return [...calculatedEffects, ...effectsIds]
  }

  get symptoms(): Symptom[] {
    const clothingsIds = Object.values(this.dbEquipedObjects.clothings || []).map(el => el.id)
    const clothingsSymptoms = clothingsIds.map(el => clothingsMap[el].symptoms)
    const effectsSymptoms = this.effects.map(el => effectsMap[el.id].symptoms)
    return [...effectsSymptoms, ...clothingsSymptoms].flat()
  }

  get modSpecial() {
    const result = {} as Special
    const specialKeys = Object.keys(this.baseSpecial) as (keyof Special)[]
    specialKeys.forEach(key => {
      result[key] = getModAttribute(this.symptoms, key)
    })
    return result
  }

  get modSecAttr() {
    const result = {} as SecAttrsValues
    const secAttrKeys = Object.keys(this.baseSecAttr) as (keyof SecAttrsValues)[]
    secAttrKeys.forEach(key => {
      result[key] = getModAttribute(this.symptoms, key)
    })
    return result
  }

  get modSkills() {
    const result = {} as SkillsValues
    const skillsKeys = Object.keys(this.baseSkills) as (keyof SkillsValues)[]
    skillsKeys.forEach(key => {
      result[key] = getModAttribute(this.symptoms, key)
    })
    return result
  }

  get currSpecial() {
    const result = {} as Special
    const specialKeys = Object.keys(this.modSpecial) as (keyof Special)[]
    specialKeys.forEach(key => {
      result[key] = this.baseSpecial[key] + this.modSpecial[key]
    })
    return result
  }

  get currSecAttr() {
    const result = {} as SecAttrsValues
    const secAttrKeys = Object.keys(this.modSecAttr) as (keyof SecAttrsValues)[]
    secAttrKeys.forEach(key => {
      result[key] = this.baseSecAttr[key] + this.modSecAttr[key]
    })
    return result
  }

  get currSkills() {
    const result = {} as SkillsValues
    const skillsKeys = Object.keys(this.modSkills) as (keyof SkillsValues)[]
    skillsKeys.forEach(key => {
      result[key] = Math.max(this.baseSkills[key] + this.modSkills[key], 1)
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

  get equipedObjects() {
    const weapons = Object.entries(this.dbEquipedObjects.weapons || {}).map(([dbKey, value]) => ({
      dbKey,
      data: weaponsMap[value.id],
      ...value
    }))
    const clothings = Object.entries(this.dbEquipedObjects.clothings || {}).map(
      ([dbKey, value]) => ({
        dbKey,
        data: clothingsMap[value.id],
        ...value
      })
    )
    return { weapons, clothings }
  }

  getEffectLength = (effect: EffectData) => {
    const isJunkie = this.dbAbilities.traits?.includes("chemReliant")
    if (effect.length && effect.isWithdrawal && isJunkie) return effect.length * 0.5
    return effect.length
  }

  getFollowingEffects = (newDate: Date) => {
    const withFollowingEffects = this.effects.filter(effect => {
      if (!effect.data.nextEffectId) return false
      if (effect.endTs && effect.endTs * 1000 > newDate.getTime()) return true
      if (!effect.startTs || !effect.data.length) return false
      const lengthInMs = effect.data.length * 3600 * 1000
      return newDate.getTime() < effect.startTs * 1000 + lengthInMs
    })
    return withFollowingEffects.map(effect => {
      const newEffectId = effect.data.nextEffectId
      let newEffectStartTs
      if (effect.endTs) {
        newEffectStartTs = effect.endTs
      } else if (effect.startTs && effect.data.length) {
        newEffectStartTs = effect.startTs + effect.data.length
      }
      const length = this.getEffectLength(effectsMap[newEffectId as EffectId]) as number
      const endTs = (newEffectStartTs as number) + length
      return { id: newEffectId, endTs }
    })
  }

  getExpiringEffects = (newDate: Date) =>
    this.effects.filter(effect => {
      if (!effect.data.length) return false
      if (effect.endTs && effect.endTs * 1000 > newDate.getTime()) return true
      if (!effect.startTs || !effect.data.length) return false
      const lengthInMs = effect.data.length * 3600 * 1000
      return newDate.getTime() < effect.startTs * 1000 + lengthInMs
    })
}
