import { Perk, PerkId } from "lib/character/abilities/perks/perks.types"
import { Trait, TraitId } from "lib/character/abilities/traits/traits.types"
import {
  getAssignedFreeRaceKPoints,
  getAssignedRawKPoints,
  getHpGainPerLevel,
  getInitKnowledgePoints,
  getInitSkillsPoints,
  getRemainingFreeKPoints,
  getSkillPointsPerLevel,
  getSpecLevelInterval
} from "lib/character/progress/progress-utils"
import { Progress } from "lib/character/progress/progress.types"
import { getLevelAndThresholds } from "lib/character/status/status-calc"
import { getRemainingTime } from "lib/common/utils/time-calc"
import { CreatedElements, defaultCreatedElements } from "lib/objects/created-elements"
import { ClothingData, ClothingId } from "lib/objects/data/clothings/clothings.types"
import { DbEquipedObjects } from "lib/objects/data/objects.types"
import weaponsMap from "lib/objects/data/weapons/weapons"
import { dbToWeapon } from "lib/objects/data/weapons/weapons.mappers"
import { Weapon } from "lib/objects/data/weapons/weapons.types"
import { computed, makeObservable, observable } from "mobx"

import { getModAttribute } from "../common/utils/char-calc"
import clothingsMap from "../objects/data/clothings/clothings"
import Squad from "./Squad"
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
import { DbEffects, Effect, EffectData, EffectId } from "./effects/effects.types"
import { Symptom } from "./effects/symptoms.type"
import { getMaxHP, getMissingHp } from "./health/health-calc"
import { Health } from "./health/health-types"
import { DbCharMeta } from "./meta/meta"
import { DbStatus } from "./status/status.types"

export type DbChar = {
  abilities: DbAbilities
  effects?: DbEffects
  equipedObj?: DbEquipedObjects
  status: DbStatus
  meta: DbCharMeta
  combats?: Record<string, string>
}

export default class Character {
  charId: string
  fullname: string
  dbAbilities: DbAbilities
  dbEffects: DbEffects
  dbEquipedObjects: DbEquipedObjects
  status: DbStatus
  date: Date
  squadId: Squad["squadId"]
  meta: DbCharMeta

  allClothings: Record<ClothingId, ClothingData>
  allEffects: Record<EffectId, EffectData>

  constructor(
    id: string,
    obj: DbChar,
    squad: { date: Date; squadId: string },
    newElements: CreatedElements = defaultCreatedElements
  ) {
    const { newClothings, newEffects } = newElements
    const { lastname, firstname } = obj.meta
    this.charId = id
    this.fullname = lastname ? `${firstname} ${lastname}` : firstname
    this.dbAbilities = obj.abilities
    this.dbEffects = obj.effects || {}
    this.dbEquipedObjects = obj.equipedObj || {}
    this.status = obj.status
    this.squadId = squad.squadId
    this.meta = obj.meta
    this.date = squad.date
    this.allClothings = { ...clothingsMap, ...newClothings }
    this.allEffects = { ...effectsMap, ...newEffects }

    makeObservable(this, {
      dbAbilities: observable,
      dbEffects: observable,
      dbEquipedObjects: observable,
      status: observable,
      squadId: observable,
      date: observable,
      //
      innateSymptoms: computed,
      health: computed,
      effects: computed,
      symptoms: computed,
      special: computed,
      secAttr: computed,
      skills: computed,
      knowledges: computed,
      equipedObjects: computed,
      //
      effectsRecord: computed,
      //
      progress: computed,
      //
      traits: computed,
      traitsRecord: computed,
      perks: computed,
      perksRecord: computed,
      //
      unarmed: computed
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
    // get all db stored effects
    const effectsIds = Object.entries(this.dbEffects).map(([dbKey, value]) => {
      let timeRemaining = null
      const { length } = this.allEffects[value.id]
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

      return { ...value, timeRemaining, dbKey, data: this.allEffects[value.id], startTs, endTs }
    })
    return effectsIds
  }

  get symptoms(): Symptom[] {
    const clothingsIds = Object.values(this.dbEquipedObjects.clothings || []).map(el => el.id)
    const clothingsSymptoms = clothingsIds.map(el => this.allClothings[el].symptoms)
    const effectsSymptoms = this.effects.map(el => this.allEffects[el.id].symptoms)
    return [...effectsSymptoms, ...clothingsSymptoms].flat()
  }

  get special() {
    const result = { base: {}, mod: {}, curr: {} } as {
      base: Special
      mod: Special
      curr: Special
    }
    specialArray.forEach(({ id }) => {
      result.base[id] = getModAttribute(this.innateSymptoms, id, this.dbAbilities.baseSPECIAL[id])
      result.curr[id] = getModAttribute(this.symptoms, id, result.base[id])
      result.mod[id] = result.curr[id] - result.base[id]
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
      result.base[id] = getModAttribute(this.innateSymptoms, id, calc(this.special.base))
      const currWithInnate = getModAttribute(this.innateSymptoms, id, calc(this.special.curr))
      result.curr[id] = getModAttribute(this.symptoms, id, currWithInnate)
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
      result.base[id] = getModAttribute(this.innateSymptoms, id, calc(this.special.base))
      result.up[id] = this.dbAbilities.upSkills[id]
      const currWithInnate = getModAttribute(this.innateSymptoms, id, calc(this.special.curr))
      const calcCurr = getModAttribute(this.symptoms, id, currWithInnate)
      result.curr[id] = Math.max(calcCurr + result.up[id], 1)
      result.mod[id] = result.curr[id] - result.base[id] - result.up[id]
    })
    return result
  }

  get knowledges() {
    return Object.entries(this.dbAbilities.knowledges)
      .map(([id, value]) => ({ id: id as KnowledgeId, value }))
      .sort((a, b) => b.value - a.value)
  }

  get knowledgesRecord() {
    return this.dbAbilities.knowledges
  }

  get equipedObjects() {
    const weapons = Object.entries(this.dbEquipedObjects.weapons || {}).map(([dbKey, value]) => ({
      dbKey,
      data: weaponsMap[value.id],
      inMagazine: value.inMagazine,
      ...value
    }))
    const clothings = Object.entries(this.dbEquipedObjects.clothings || {}).map(
      ([dbKey, value]) => ({
        dbKey,
        data: this.allClothings[value.id],
        ...value
      })
    )
    return { weapons, clothings }
  }

  get effectsRecord() {
    const effectsRecord = {} as Record<EffectId, Effect>
    Object.values(this.effects).forEach(effect => {
      effectsRecord[effect.id] = { ...effect }
    })
    return effectsRecord
  }

  get progress(): Progress {
    const { traits, knowledges } = this.dbAbilities
    const { background, exp } = this.status
    const { level } = getLevelAndThresholds(exp)

    const initSkillPoints = getInitSkillsPoints()
    const skillPointsPerLevel = getSkillPointsPerLevel(this.special.base, traits || [])
    const unlockedSkillPoints = skillPointsPerLevel * (level - 1) + initSkillPoints
    const usedSkillsPoints = Object.values(this.skills.up).reduce((acc, curr) => curr + acc, 0)
    const initKPoints = getInitKnowledgePoints()
    const unlockedKnowledgePoints = initKPoints + (level - 1)
    const rawKpointsAssigned = getAssignedRawKPoints(knowledges)
    const freeRaceKPointsAssigned = getAssignedFreeRaceKPoints(knowledges, "human")
    const usedKnowledgePoints = rawKpointsAssigned - freeRaceKPointsAssigned
    const availableFreeKnowledgePoints = getRemainingFreeKPoints(knowledges, background)

    return {
      exp: this.status.exp,
      level: getLevelAndThresholds(this.status.exp).level,
      hpGainPerLevel: getHpGainPerLevel(this.special.base),
      specLevelInterval: getSpecLevelInterval(traits || []),
      usedSkillsPoints,
      availableSkillPoints: unlockedSkillPoints - usedSkillsPoints,
      usedKnowledgePoints,
      availableKnowledgePoints: unlockedKnowledgePoints - usedKnowledgePoints,
      availableFreeKnowledgePoints
    }
  }

  get traits(): Trait[] {
    const { traits } = this.dbAbilities
    return traits?.map(traitId => traitsMap[traitId]) || []
  }

  get traitsRecord(): Record<TraitId, Trait> {
    const traitsRecord = {} as Record<TraitId, Trait>
    this.traits.forEach(trait => {
      traitsRecord[trait.id] = { ...trait }
    })
    return traitsRecord
  }

  get perks() {
    const { perks } = this.dbAbilities
    return perks?.map(perkId => perksMap[perkId]) || []
  }

  get perksRecord() {
    const perksRecord = {} as Record<PerkId, Perk>
    this.perks.forEach(perk => {
      perksRecord[perk.id] = { ...perk }
    })
    return perksRecord
  }

  get unarmed(): Weapon {
    const charData = {
      dbAbilities: this.dbAbilities,
      innateSymptoms: this.innateSymptoms,
      currSkills: this.skills.curr,
      currSpecial: this.special.curr,
      dbEquipedObjects: this.dbEquipedObjects
    }
    return dbToWeapon(["unarmed", { id: "unarmed" }], charData, undefined)
  }
}
