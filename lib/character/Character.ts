import { Perk, PerkId } from "lib/character/abilities/perks/perks.types"
import { Trait, TraitId } from "lib/character/abilities/traits/traits.types"
import {
  getHpGainPerLevel,
  getInitKnowledgePoints,
  getInitSkillsPoints,
  getSkillPointsPerLevel,
  getSpecLevelInterval,
  getUsedKnowledgesPoints
} from "lib/character/progress/progress-utils"
import { Progress } from "lib/character/progress/progress.types"
import { getLevelAndThresholds } from "lib/character/status/status-calc"
import { getRemainingTime } from "lib/common/utils/time-calc"
import { DbEquipedObjects } from "lib/objects/data/objects.types"
import weaponsMap from "lib/objects/data/weapons/weapons"
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
import { DbEffects, Effect, EffectId } from "./effects/effects.types"
import { Symptom } from "./effects/symptoms.type"
import { getMaxHP, getMissingHp } from "./health/health-calc"
import { Health } from "./health/health-types"
import { DbStatus } from "./status/status.types"

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
  squadId: Squad["squadId"]

  constructor(obj: DbChar, squad: Squad, charId: string) {
    this.charId = charId
    this.dbAbilities = obj.abilities
    this.dbEffects = obj.effects || {}
    this.dbEquipedObjects = obj.equipedObj || {}
    this.status = obj.status
    this.squadId = squad.squadId
    this.date = squad.date

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
      perksRecord: computed
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
    return effectsIds
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
        data: clothingsMap[value.id],
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
    const { level } = getLevelAndThresholds(this.status.exp)

    const initSkillPoints = getInitSkillsPoints()
    const skillPointsPerLevel = getSkillPointsPerLevel(this.special.base, traits || [])
    const unlockedSkillPoints = skillPointsPerLevel * (level - 1) + initSkillPoints
    const usedSkillsPoints = Object.values(this.skills.up).reduce((acc, curr) => curr + acc, 0)
    const initKnowledgePoints = getInitKnowledgePoints(this.status.background)
    const unlockedKnowledgePoints = initKnowledgePoints + (level - 1)
    const usedKnowledgePoints = getUsedKnowledgesPoints(knowledges)

    return {
      exp: this.status.exp,
      level: getLevelAndThresholds(this.status.exp).level,
      hpGainPerLevel: getHpGainPerLevel(this.special.base),
      specLevelInterval: getSpecLevelInterval(traits || []),
      usedSkillsPoints,
      availableSkillPoints: unlockedSkillPoints - usedSkillsPoints,
      usedKnowledgePoints,
      availableKnowledgePoints: unlockedKnowledgePoints - usedKnowledgePoints
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
}
