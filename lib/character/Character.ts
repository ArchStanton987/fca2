import database from "config/firebase"
import dbKeys from "db/db-keys"
import { ref, update } from "firebase/database"
import { getRandomArbitrary } from "lib/common/utils/dice-calc"
import { getRemainingTime } from "lib/common/utils/time-calc"
import {
  Clothing,
  ClothingData,
  ClothingId,
  DbClothing
} from "lib/objects/data/clothings/clothings.types"
import {
  Consumable,
  ConsumableData,
  DbConsumable
} from "lib/objects/data/consumables/consumables.types"
import {
  DbMiscObject,
  MiscObject,
  MiscObjectData
} from "lib/objects/data/misc-objects/misc-objects-types"
import { DbEquipedObjects, DbInventory } from "lib/objects/data/objects.types"
import weaponsMap from "lib/objects/data/weapons/weapons"
import { DbWeapon, Weapon, WeaponData } from "lib/objects/data/weapons/weapons.types"
import { computed, makeObservable, observable } from "mobx"

import {
  addCollectible,
  groupAddCollectible,
  groupRemoveCollectible,
  groupUpdateValue,
  removeCollectible,
  updateValue
} from "api/api-rtdb"

import { getModAttribute } from "../common/utils/char-calc"
import clothingsMap from "../objects/data/clothings/clothings"
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
import { DbEffect, DbEffects, Effect, EffectData, EffectId } from "./effects/effects.types"
import { Symptom } from "./effects/symptoms.type"
import { LimbHpId, healthStates, limbsMap, radStates } from "./health/health"
import { getMaxHP, getMissingHp } from "./health/health-calc"
import { Health } from "./health/health-types"
import { DbStatus } from "./status/status.types"

type DbObj = {
  data: DbWeapon | DbClothing | DbConsumable | DbMiscObject
  url: string
}

export type DbChar = {
  abilities: DbAbilities
  effects?: DbEffects
  equipedObj?: DbEquipedObjects
  inventory?: DbInventory
  status: DbStatus
}

export default class Character {
  charId: string
  dbAbilities: DbAbilities
  dbEffects: DbEffects
  dbEquipedObjects: DbEquipedObjects
  dbInventory: DbInventory
  status: DbStatus
  date: Date

  constructor(obj: DbChar, date: Date, charId: string) {
    this.charId = charId
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

  getExpiringEffects = (newDate: Date) =>
    this.effects.filter(effect => {
      if (!effect.data.length) return false
      if (effect.endTs && effect.endTs * 1000 > newDate.getTime()) return true
      if (!effect.startTs || !effect.data.length) return false
      const effectLength = this.getEffectLength(effect.data)
      const lengthInH = effectLength || effect.data.length
      return newDate.getTime() < effect.startTs * 1000 + lengthInH * 3600 * 1000
    })

  getFollowingEffects = (newDate: Date): DbEffect[] =>
    this.getExpiringEffects(newDate)
      .filter(effect => !!effect.data.nextEffectId)
      .map(effect => {
        const newEffectId = effect.data.nextEffectId as EffectId
        let newEffectStartTs
        if (effect.endTs) {
          newEffectStartTs = effect.endTs * 1000
        } else if (effect.startTs && effect.data.length) {
          const effectLength = this.getEffectLength(effect.data)
          const lengthInH = effectLength || effect.data.length
          newEffectStartTs = effect.startTs * 1000 + lengthInH * 3600 * 1000
        }
        const lengthInH = this.getEffectLength(effectsMap[newEffectId]) as number
        const endTs = (newEffectStartTs as number) + lengthInH * 3600
        return { id: newEffectId, endTs }
      })

  getNewLimbsHp = (newDate: Date) => {
    const { healHpPerHour } = this.secAttr.curr
    const hoursPassed = (newDate.getTime() - this.date.getTime()) / 3600000
    const missingHp = getMissingHp(this.status)
    const maxHealedHp = Math.round(healHpPerHour * hoursPassed)
    const healedHp = Math.min(missingHp, maxHealedHp)
    const newLimbsHp = { ...this.health.limbsHp }
    const limbsHpArray = Object.entries(this.health.limbsHp).map(([id, value]) => ({ id, value }))
    for (let i = 0; i < healedHp; i += 1) {
      const healableLimbs = limbsHpArray.filter(
        ({ value, id }) => value < limbsMap[id as LimbHpId].maxValue
      )
      const randomIndex = getRandomArbitrary(0, healableLimbs.length)
      const limbIdToHeal = healableLimbs[randomIndex].id
      newLimbsHp[limbIdToHeal as LimbHpId] += 1
    }
    return newLimbsHp
  }

  onChangeDate = async (newDate: Date) => {
    const effectUrl = dbKeys.char(this.charId).effects
    const expiringEffectsPaths = this.getExpiringEffects(newDate).map(el =>
      effectUrl.concat(el.dbKey as string)
    )
    const followingEffects = this.getFollowingEffects(newDate).map(el => ({
      data: el,
      containerUrl: effectUrl
    }))
    const newLimbsHp = this.getNewLimbsHp(newDate)
    const statusUrl = dbKeys.char(this.charId).status
    const limbsArr = Object.entries(newLimbsHp).map(([id, value]) => ({
      url: statusUrl.concat(`/${id}`),
      data: value
    }))
    return Promise.all([
      groupRemoveCollectible(expiringEffectsPaths),
      groupAddCollectible(followingEffects),
      groupUpdateValue(limbsArr)
    ])
  }

  addEffect = async (effectId: EffectId) => {
    const effectsPath = dbKeys.char(this.charId).effects
    const endTs = effectId && this.getEffectLength(effectsMap[effectId])
    const startTs = this.date.getTime() / 1000
    const newEffect = { id: effectId, startTs, endTs }
    addCollectible(effectsPath, newEffect)
  }

  groupAddEffects = async (effectsToAdd: EffectId[]) => {
    const effectsPath = dbKeys.char(this.charId).effects
    const effects = effectsToAdd.map(el => {
      const endTs = this.getEffectLength(effectsMap[el])
      const data = { id: el, startTs: this.date.getTime() / 1000, endTs }
      return { data, containerUrl: effectsPath }
    })
    return groupAddCollectible(effects)
  }

  removeEffect = async (dbKey: string) => {
    const effectPath = dbKeys.char(this.charId).effects.concat(`/${dbKey}`)
    removeCollectible(effectPath)
  }

  updateStatus = async (updates: Partial<DbStatus>) => {
    const statusPath = dbKeys.char(this.charId).status
    const updatesArr = Object.entries(updates).map(([id, value]) => ({
      url: statusPath.concat(`/${id}`),
      data: value
    }))
    return groupUpdateValue(updatesArr)
  }

  consume = async ({ data, dbKey, remainingUse }: Consumable) => {
    // TODO: apply modifiers

    const newEffectId = data.effectId
    if (newEffectId) {
      this.addEffect(newEffectId)
    }

    const consumablePath = dbKeys.char(this.charId).inventory.consumables
    const objectPath = consumablePath.concat(`/${dbKey}`)
    if (typeof remainingUse === "number" && remainingUse === 1) {
      await removeCollectible(objectPath)
    }
    if (typeof remainingUse === "number" && remainingUse > 1) {
      const remainingUsePath = objectPath.concat("/remainingUse")
      const updates = { remainingUse: remainingUse - 1 }
      await update(ref(database, remainingUsePath), updates)
    }
  }

  toggleEquip = async (obj: Weapon | Clothing) => {
    // TODO: prevent equiping if requirements are not met
    // weapons : no more than 2 light weapons or 1 heavy weapon
    // clothings : no more than 1 armor per body part
    const isCloth = clothingsMap[obj.id as ClothingId] !== undefined
    const objectCategory = isCloth ? ("clothings" as const) : ("weapons" as const)
    const isEquiped = !!this.dbEquipedObjects[objectCategory]?.[obj.dbKey]
    const path = dbKeys.char(this.charId).equipedObjects[objectCategory].concat(`/${obj.dbKey}`)
    if (!isEquiped) {
      const newEquipedObject = { id: obj.id }
      updateValue(path, newEquipedObject)
      return
    }
    removeCollectible(path)
  }

  getDbObj = (obj: WeaponData | ClothingData | ConsumableData | MiscObjectData): DbObj => {
    const url = dbKeys.char(this.charId).inventory
    const isWeapon = "damageType" in obj
    const isCloth = "armorClass" in obj
    const isConsumable = "effectId" in obj
    if (isWeapon) return { data: { id: obj.id }, url: url.weapons }
    if (isCloth) return { data: { id: obj.id }, url: url.clothings }
    if (isConsumable) return { data: { id: obj.id }, url: url.consumables }
    return { data: { id: obj.id }, url: url.objects }
  }

  addToInv = async (obj: WeaponData | ClothingData | ConsumableData | MiscObjectData) => {
    const { data, url } = this.getDbObj(obj)
    addCollectible(url, data)
  }

  removeFromInv = async (obj: Weapon | Clothing | Consumable | MiscObject) => {
    const { url } = this.getDbObj(obj.data)
    const objectPath = url.concat(`/${obj.dbKey}`)
    removeCollectible(objectPath)
  }
}
