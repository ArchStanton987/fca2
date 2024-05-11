import dbKeys from "db/db-keys"
import { HealthUpdateState } from "lib/character/health/health-reducer"
import { getRandomArbitrary } from "lib/common/utils/dice-calc"
import { getRemainingTime } from "lib/common/utils/time-calc"
import { Clothing, ClothingData, DbClothing } from "lib/objects/data/clothings/clothings.types"
import consumablesMap from "lib/objects/data/consumables/consumables"
import {
  Consumable,
  ConsumableData,
  ConsumableId,
  DbConsumable
} from "lib/objects/data/consumables/consumables.types"
import {
  DbMiscObject,
  MiscObject,
  MiscObjectData
} from "lib/objects/data/misc-objects/misc-objects-types"
import { DbEquipedObjects } from "lib/objects/data/objects.types"
import weaponsMap from "lib/objects/data/weapons/weapons"
import { DbWeapon, Weapon, WeaponData } from "lib/objects/data/weapons/weapons.types"
import { ExchangeState } from "lib/objects/objects-reducer"
import { computed, makeObservable, observable } from "mobx"

import {
  addCollectible,
  groupAddCollectible,
  groupRemoveCollectible,
  groupUpdateValue,
  removeCollectible
} from "api/api-rtdb"
import { UpdateStatusState } from "screens/MainTabs/modals/UpdateStatusModal/UpdateStatusModal.types"

import { getModAttribute } from "../common/utils/char-calc"
import clothingsMap from "../objects/data/clothings/clothings"
import { DbAbilities } from "./abilities/abilities.types"
import { KnowledgeId } from "./abilities/knowledges/knowledge-types"
import perksMap from "./abilities/perks/perks"
import { secAttrArray } from "./abilities/sec-attr/sec-attr"
import { SecAttrsValues } from "./abilities/sec-attr/sec-attr-types"
import skillsMap from "./abilities/skills/skills"
import { SkillsValues } from "./abilities/skills/skills.types"
import { specialArray } from "./abilities/special/special"
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
  status: DbStatus
}

export default class Character {
  charId: string
  dbAbilities: DbAbilities
  dbEffects: DbEffects
  dbEquipedObjects: DbEquipedObjects
  status: DbStatus
  date: Date

  constructor(obj: DbChar, date: Date, charId: string) {
    this.charId = charId
    this.dbAbilities = obj.abilities
    this.dbEffects = obj.effects || {}
    this.dbEquipedObjects = obj.equipedObj || {}
    this.status = obj.status
    this.date = date

    makeObservable(this, {
      dbAbilities: observable,
      dbEffects: observable,
      dbEquipedObjects: observable,
      status: observable,
      date: observable,
      //
      innateSymptoms: computed,
      //
      health: computed,
      //
      effects: computed,
      symptoms: computed,
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

  get health(): Health {
    const maxHp = getMaxHP(this.dbAbilities.baseSPECIAL, this.status.exp)
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
      let startTs
      let endTs
      if (value.endTs) {
        timeRemaining = getRemainingTime(this.date.getTime(), value.endTs)
        endTs = new Date(value.endTs)
      }
      if (value.startTs && length) {
        const lengthInMs = length * 3600000
        const end = new Date(value.startTs).getTime() + lengthInMs
        startTs = new Date(value.startTs)
        timeRemaining = getRemainingTime(this.date.getTime(), end)
      }

      return { ...value, timeRemaining, dbKey, data: effectsMap[value.id], startTs, endTs }
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

  get special() {
    const result = { base: {}, mod: {}, curr: {} } as {
      base: Special
      mod: Special
      curr: Special
    }
    specialArray.forEach(({ id }) => {
      result.base[id] = this.dbAbilities.baseSPECIAL[id] + getModAttribute(this.innateSymptoms, id)
      result.mod[id] = getModAttribute(this.symptoms, id)
      result.curr[id] = result.base[id] + result.mod[id]
    })
    return result
  }

  get secAttr() {
    const result = { base: {}, mod: {}, curr: {} } as {
      base: SecAttrsValues
      mod: SecAttrsValues
      curr: SecAttrsValues
    }
    secAttrArray.forEach(({ id, calc }) => {
      result.base[id] = calc(this.special.base) + getModAttribute(this.innateSymptoms, id)
      result.curr[id] = calc(this.special.curr) + getModAttribute(this.symptoms, id)
      result.mod[id] = result.curr[id] - result.base[id]
    })
    return result
  }

  get skills() {
    const result = { base: {}, up: {}, mod: {}, curr: {} } as {
      base: SkillsValues
      up: SkillsValues
      mod: SkillsValues
      curr: SkillsValues
    }
    Object.values(skillsMap).forEach(({ id, calc }) => {
      result.base[id] = calc(this.special.base) + getModAttribute(this.innateSymptoms, id)
      result.up[id] = this.dbAbilities.upSkills[id]
      result.curr[id] = Math.max(
        calc(this.special.curr) + getModAttribute(this.symptoms, id) + result.up[id],
        1
      )
      result.mod[id] = result.curr[id] - result.base[id] - result.up[id]
    })
    return result
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

  getEffectLengthInH = (effect: EffectData) => {
    const isJunkie = this.dbAbilities.traits?.includes("chemReliant")
    if (effect.length && effect.isWithdrawal && isJunkie) return effect.length * 0.5
    return effect.length
  }

  private getExpiringEffects = (newDate: Date) =>
    this.effects.filter(effect => {
      if (!effect.data.length) return false
      if (effect.endTs && effect?.endTs.getTime() < newDate.getTime()) return true
      if (!effect.startTs || !effect.data.length) return false
      const effectLength = this.getEffectLengthInH(effect.data)
      const lengthInH = effectLength || effect.data.length
      return effect.startTs.getTime() + lengthInH * 3600 * 1000 < newDate.getTime()
    })

  private getFollowingEffects = (newDate: Date): DbEffect[] =>
    this.getExpiringEffects(newDate)
      .filter(effect => !!effect.data.nextEffectId && !!effect.endTs)
      .map(effect => {
        const newEffectId = effect.data.nextEffectId as EffectId
        const newEffectStartTs = new Date(effect.endTs as Date)
        const lengthInH = this.getEffectLengthInH(effectsMap[newEffectId]) as number
        const endInMs = newEffectStartTs.getTime() + lengthInH * 3600
        const endTs = new Date(endInMs).toJSON()
        return { id: newEffectId, endTs }
      })

  private getNewLimbsHp = (newDate: Date) => {
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
    const effectsUrl = dbKeys.char(this.charId).effects
    const expiringEffectsPaths = this.getExpiringEffects(newDate).map(el =>
      effectsUrl.concat(`/${el.dbKey as string}`)
    )
    const followingEffects = this.getFollowingEffects(newDate).map(el => ({
      data: el,
      containerUrl: effectsUrl
    }))
    const newLimbsHp = this.getNewLimbsHp(newDate)
    const statusUrl = dbKeys.char(this.charId).status.index
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
    const hasEffect = this.effects.some(el => el.id === effectId)
    if (hasEffect) return null
    const length = effectId && this.getEffectLengthInH(effectsMap[effectId])
    const startTs = this.date
    const endTs = length ? new Date(startTs.getTime() + length * 3600 * 1000) : null
    const newEffect = { id: effectId, startTs, endTs }
    const effectsPath = dbKeys.char(this.charId).effects
    return addCollectible(effectsPath, newEffect)
  }

  groupAddEffects = async (effects: EffectId[]) => {
    const effectsToAdd = effects.filter(el => !this.effects.some(effect => effect.id === el))
    const effectsPath = dbKeys.char(this.charId).effects
    const dbEffects = effectsToAdd.map(el => {
      const length = this.getEffectLengthInH(effectsMap[el])
      const endTs = length ? new Date(this.date.getTime() + length * 3600 * 1000) : null
      const data = { id: el, startTs: this.date, endTs }
      return { data, containerUrl: effectsPath }
    })
    return groupAddCollectible(dbEffects)
  }

  removeEffect = async (dbKey: string) => {
    const effectPath = dbKeys.char(this.charId).effects.concat(`/${dbKey}`)
    removeCollectible(effectPath)
  }

  updateStatus = async (updates: UpdateStatusState) => {
    const statusPath = dbKeys.char(this.charId).status.index
    const updatesArr = Object.entries(updates).map(([id, value]) => ({
      url: statusPath.concat(`/${id}`),
      data: value.initValue + value.count
    }))
    return groupUpdateValue(updatesArr)
  }

  updateHealth = async (update: HealthUpdateState) => {
    const statusPath = dbKeys.char(this.charId).status.index
    const updatesArr = Object.entries(update).map(([id, value]) => ({
      url: statusPath.concat(`/${id}`),
      data: value.initValue + value.count
    }))
    return groupUpdateValue(updatesArr)
  }

  getDbObj = (obj: WeaponData | ClothingData | ConsumableData | MiscObjectData): DbObj => {
    const url = dbKeys.char(this.charId).inventory
    const isWeapon = "damageType" in obj
    const isCloth = "armorClass" in obj
    const isConsumable = "effectId" in obj
    if (isWeapon) return { data: { id: obj.id }, url: url.weapons }
    if (isCloth) return { data: { id: obj.id }, url: url.clothings }
    if (isConsumable)
      return {
        data: { id: obj.id, remainingUse: consumablesMap[obj.id].maxUsage },
        url: url.consumables
      }
    return { data: { id: obj.id }, url: url.miscObjects }
  }

  groupAddToInv = async (state: ExchangeState) => {
    // TODO: allow to remove at the same time
    // TODO: prevent to add if:
    // - new total weight > maxCarryWeight
    // - new total place > maxPlace
    const promises = []
    const { caps, ammo, weapons, clothings, consumables, miscObjects } = state
    const capsUpdates = Object.values(caps).map(content => {
      const url = dbKeys.char(this.charId).inventory.caps
      return { url, data: content.inInventory + content.count }
    })
    promises.push(groupUpdateValue(capsUpdates))
    const ammoUpdates = Object.entries(ammo).map(([id, content]) => {
      const url = dbKeys.char(this.charId).inventory.ammo.concat(`/${id}`)
      const data = content.inInventory + content.count
      return { url, data }
    })
    promises.push(groupUpdateValue(ammoUpdates))
    const weaponsUpdates: { containerUrl: string; data: any }[] = []
    Object.entries(weapons).forEach(([id, content]) => {
      const containerUrl = dbKeys.char(this.charId).inventory.weapons
      for (let i = 0; i < content.count; i += 1) {
        weaponsUpdates.push({ containerUrl, data: { id } })
      }
    })
    promises.push(groupAddCollectible(weaponsUpdates))
    const clothingsUpdates: { containerUrl: string; data: any }[] = []
    Object.entries(clothings).forEach(([id, content]) => {
      const containerUrl = dbKeys.char(this.charId).inventory.clothings
      for (let i = 0; i < content.count; i += 1) {
        clothingsUpdates.push({ containerUrl, data: { id } })
      }
    })
    promises.push(groupAddCollectible(clothingsUpdates))
    const consumablesUpdates: { containerUrl: string; data: any }[] = []
    Object.entries(consumables).forEach(([id, content]) => {
      const containerUrl = dbKeys.char(this.charId).inventory.consumables
      for (let i = 0; i < content.count; i += 1) {
        consumablesUpdates.push({
          containerUrl,
          data: { id, remainingUse: consumablesMap[id as ConsumableId].maxUsage }
        })
      }
    })
    promises.push(groupAddCollectible(consumablesUpdates))
    const miscObjectsUpdates: { containerUrl: string; data: any }[] = []
    Object.entries(miscObjects).forEach(([id, content]) => {
      const containerUrl = dbKeys.char(this.charId).inventory.miscObjects
      for (let i = 0; i < content.count; i += 1) {
        miscObjectsUpdates.push({ containerUrl, data: { id } })
      }
    })
    promises.push(groupAddCollectible(miscObjectsUpdates))
    return Promise.all(promises)
  }

  removeFromInv = async (
    obj: Weapon | Clothing | Consumable | MiscObject,
    isEquiped: boolean = false
  ) => {
    const promises = []
    const { url } = this.getDbObj(obj.data)
    const objectPath = url.concat(`/${obj.dbKey}`)
    promises.push(removeCollectible(objectPath))
    if (isEquiped) {
      const isWeapon = "damageType" in obj.data
      const category = isWeapon ? "weapons" : "clothings"
      const equipedObjPath = dbKeys
        .char(this.charId)
        .equipedObjects[category].concat(`/${obj.dbKey}`)
      promises.push(removeCollectible(equipedObjPath))
    }
    return Promise.all(promises)
  }
}
