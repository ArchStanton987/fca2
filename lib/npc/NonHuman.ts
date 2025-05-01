/* eslint-disable class-methods-use-this */
import Playable from "lib/character/Playable"
import Squad from "lib/character/Squad"
import { DbAbilities } from "lib/character/abilities/abilities.types"
import {
  KnowledgeId,
  KnowledgeLevelValue
} from "lib/character/abilities/knowledges/knowledge-types"
import { nonHumanSecAttrArray } from "lib/character/abilities/sec-attr/non-human-sec-attr"
import { SecAttrsValues } from "lib/character/abilities/sec-attr/sec-attr-types"
import skillsMap, { skillsArray } from "lib/character/abilities/skills/skills"
import { SkillsValues } from "lib/character/abilities/skills/skills.types"
import { specialArray } from "lib/character/abilities/special/special"
import { Special } from "lib/character/abilities/special/special.types"
import effectsMap from "lib/character/effects/effects"
import { DbEffects, Effect, EffectData, EffectId } from "lib/character/effects/effects.types"
import { Symptom } from "lib/character/effects/symptoms.type"
import { getMissingHp } from "lib/character/health/health-calc"
import { Health } from "lib/character/health/health-types"
import { DbCharMeta } from "lib/character/meta/meta"
import { Progress } from "lib/character/progress/progress.types"
import { DbStatus } from "lib/character/status/status.types"
import { DbPlayableCombatRecap } from "lib/combat/combats.types"
import { getModAttribute } from "lib/common/utils/char-calc"
import { getRemainingTime } from "lib/common/utils/time-calc"
import { CreatedElements, defaultCreatedElements } from "lib/objects/created-elements"
import { DbEquipedObjects } from "lib/objects/data/objects.types"
import { attackToWeapon } from "lib/objects/data/weapons/weapons.mappers"
import { Weapon, WeaponId } from "lib/objects/data/weapons/weapons.types"
import { computed, makeObservable, observable } from "mobx"

import { isKeyOf } from "utils/ts-utils"

import enemyTemplates from "./const/npc-templates"
import { NonHumanNpcTemplate } from "./npc.types"

export default class NonHuman implements Playable {
  charId: string
  fullname: string
  isEnemy: boolean
  status: DbStatus
  date: Date
  squadId: Squad["squadId"]
  meta: DbCharMeta
  combats: Record<string, DbPlayableCombatRecap>
  dbEffects: DbEffects
  allEffects: Record<EffectId, EffectData>
  dbAbilities: DbAbilities

  constructor(
    id: string,
    payload: {
      status: DbStatus
      meta: DbCharMeta
      effects?: DbEffects
      combats?: Record<string, DbPlayableCombatRecap>
    },
    game: { date: Date; squadId: string; membersRecord: Record<string, any> },
    newElements: CreatedElements = defaultCreatedElements
  ) {
    const { newEffects } = newElements

    const { lastname, firstname } = payload.meta
    this.charId = id
    this.fullname = lastname ? `${firstname} ${lastname}` : firstname
    this.isEnemy = !(this.charId in game.membersRecord)
    this.status = payload.status
    this.date = game.date
    this.squadId = game.squadId
    this.meta = payload.meta
    this.combats = payload.combats ?? {}
    this.dbEffects = payload.effects ?? {}
    this.allEffects = { ...effectsMap, ...newEffects }
    this.dbAbilities = {
      baseSPECIAL: Object.fromEntries(specialArray.map(e => [e.id, 5])) as Special,
      knowledges: {} as Record<KnowledgeId, KnowledgeLevelValue>,
      upSkills: Object.fromEntries(skillsArray.map(e => [e.id, 0])) as SkillsValues
    }

    makeObservable(this, {
      dbEffects: observable,
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
      dbEquipedObjects: computed,
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

  get data(): NonHumanNpcTemplate {
    if (this.meta.speciesId === "human") throw new Error("Human enemy is not a non-human enemy")
    if (!isKeyOf(this.meta.speciesId, enemyTemplates))
      throw new Error(`${this.meta.speciesId} not in templates`)
    const templateGroup = enemyTemplates[this.meta.speciesId]
    if (!isKeyOf(this.meta.templateId, templateGroup))
      throw new Error(`${this.meta.templateId} not in templates`)
    const template = templateGroup[this.meta.templateId]
    return template
  }

  get innateSymptoms() {
    return []
  }

  get health(): Health {
    const maxHp = this.data.hp
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
    const effectsSymptoms = this.effects.map(el => this.allEffects[el.id].symptoms)
    return effectsSymptoms.flat()
  }

  get special() {
    const result = { base: {}, mod: {}, curr: {} } as {
      base: Special
      mod: Special
      curr: Special
    }
    specialArray.forEach(({ id }) => {
      result.base[id] = 5
      result.curr[id] = 5
      result.mod[id] = 0
    })
    return result
  }

  get secAttr() {
    const result = { base: {}, mod: {}, curr: {} } as {
      base: SecAttrsValues
      mod: SecAttrsValues
      curr: SecAttrsValues
    }
    const { innateSymptoms, data } = this
    nonHumanSecAttrArray.forEach(({ id, calc }) => {
      result.base[id] = getModAttribute(innateSymptoms, id, calc(data))
      const currWithInnate = getModAttribute(innateSymptoms, id, calc(data))
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
    const { special, innateSymptoms } = this
    Object.values(skillsMap).forEach(({ id, calc }) => {
      result.base[id] = getModAttribute(innateSymptoms, id, calc(special.base))
      result.up[id] = 0
      const currWithInnate = getModAttribute(innateSymptoms, id, calc(special.curr))
      const calcCurr = getModAttribute(this.symptoms, id, currWithInnate)
      result.curr[id] = Math.max(calcCurr + result.up[id], 1)
      result.mod[id] = result.curr[id] - result.base[id] - result.up[id]
    })
    return result
  }

  get knowledges() {
    return []
  }

  get knowledgesRecord() {
    return {} as Record<KnowledgeId, KnowledgeLevelValue>
  }

  get equipedObjects() {
    const weapons = this.data.attacks.map(attack => attackToWeapon(attack))
    return { weapons, clothings: [] }
  }

  get dbEquipedObjects() {
    const weapons: Record<
      string,
      { id: WeaponId; inMagazine: 0; dbKey: string; data: Weapon["data"] }
    > = {}
    Object.entries(this.data.attacks).forEach(([key, attack]) => {
      weapons[key] = {
        id: attack.name as WeaponId,
        inMagazine: 0,
        dbKey: attack.name,
        data: attackToWeapon(attack).data
      }
    })
    return { weapons, clothings: {} as DbEquipedObjects["clothings"] }
  }

  get equipedObjectsRecord() {
    return { weapons: {}, clothings: {} }
  }

  get effectsRecord() {
    return {}
  }

  get progress(): Progress {
    return {
      exp: 0,
      level: 1,
      hpGainPerLevel: 0,
      specLevelInterval: 0,
      usedSkillsPoints: 0,
      availableSkillPoints: 0,
      usedKnowledgePoints: 0,
      availableKnowledgePoints: 0,
      availableFreeKnowledgePoints: 0
    }
  }

  get traits() {
    return []
  }

  get traitsRecord() {
    return {}
  }

  get perks() {
    return []
  }

  get perksRecord() {
    return {}
  }

  get unarmed(): Weapon & { id: string } {
    return attackToWeapon(this.data.attacks[0])
  }
}
