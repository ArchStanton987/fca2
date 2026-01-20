import { getModAttribute } from "lib/common/utils/char-calc"
import { critters } from "lib/npc/const/npc-templates"

import { Symptom } from "../effects/symptoms.type"
import { TemplateId } from "../info/CharInfo"
import { DbAbilities } from "./abilities.types"
import { KnowledgeId, KnowledgeLevelValue } from "./knowledges/knowledge-types"
import perksMap from "./perks/perks"
import { PerkId } from "./perks/perks.types"
import { defaultSecAttr, secAttrArray } from "./sec-attr/sec-attr"
import { SecAttrsValues } from "./sec-attr/sec-attr-types"
import skillsMap, { defaultNullSkillsValues, defaultSkillsValues } from "./skills/skills"
import { SkillsValues } from "./skills/skills.types"
import { specialArray } from "./special/special"
import { Special } from "./special/special.types"
import traitsMap from "./traits/traits"
import { TraitId } from "./traits/traits.types"

const defaultSpecial = {
  strength: 5,
  perception: 3,
  endurance: 5,
  charisma: 1,
  intelligence: 1,
  agility: 5,
  luck: 5
}

export default class Abilities {
  special: {
    base: Special
    mod: Special
    curr: Special
  }

  secAttr: {
    base: SecAttrsValues
    mod: SecAttrsValues
    curr: SecAttrsValues
  }

  skills: {
    base: SkillsValues
    up: SkillsValues
    mod: SkillsValues
    curr: SkillsValues
  }

  knowledges: Partial<Record<KnowledgeId, KnowledgeLevelValue>>

  perks: Partial<Record<PerkId, PerkId>>

  traits: Partial<Record<TraitId, TraitId>>

  constructor({
    payload,
    symptoms,
    templateId
  }: {
    payload: DbAbilities
    symptoms: Symptom[] // health symptoms, items symptoms, effects symptoms
    templateId: TemplateId
  }) {
    const traits = Object.values(payload?.traits ?? {})
    const perks = Object.values(payload?.perks ?? {})
    const traitsSymptoms = traits.map(t => traitsMap[t as TraitId].symptoms)
    const perksSymptoms = perks.map(t => perksMap[t as PerkId].symptoms)
    const innateSymptoms = [...traitsSymptoms, ...perksSymptoms].flat()

    const isCritter = templateId in critters
    const initSpecial = isCritter
      ? critters[templateId].special
      : payload.baseSPECIAL ?? defaultSpecial
    const initUpSkills = isCritter
      ? defaultNullSkillsValues
      : payload.upSkills ?? defaultNullSkillsValues

    const special = { base: {}, mod: {}, curr: {} } as {
      base: Special
      mod: Special
      curr: Special
    }
    specialArray.forEach(({ id }) => {
      special.base[id] = getModAttribute(innateSymptoms, id, initSpecial[id])
      special.curr[id] = getModAttribute(symptoms, id, special.base[id])
      special.mod[id] = special.curr[id] - special.base[id]
    })
    this.special = special

    const secAttr = { base: {}, mod: {}, curr: {} } as {
      base: SecAttrsValues
      mod: SecAttrsValues
      curr: SecAttrsValues
    }

    if (isCritter) {
      secAttr.base = {
        ...defaultSecAttr,
        actionPoints: critters[templateId].actionPoints,
        mentalStrength: critters[templateId].mentalStrength,
        critChance: critters[templateId].critChance,
        armorClass: critters[templateId].armorClass,
        poisResist: critters[templateId].resistances.poisResist,
        radsResist: critters[templateId].resistances.radsResist
      }
    }
    secAttrArray.forEach(({ id, calc }) => {
      if (!isCritter) {
        secAttr.base[id] = getModAttribute(innateSymptoms, id, calc(this.special.base))
      }
      const currWithInnate = getModAttribute(
        innateSymptoms,
        id,
        isCritter ? secAttr.base[id] : calc(this.special.curr)
      )
      secAttr.curr[id] = getModAttribute(symptoms, id, currWithInnate)
      secAttr.mod[id] = secAttr.curr[id] - secAttr.base[id]
    })
    this.secAttr = secAttr

    const skills = { base: {}, up: {}, mod: {}, curr: {} } as {
      base: SkillsValues
      up: SkillsValues
      mod: SkillsValues
      curr: SkillsValues
    }

    if (isCritter) {
      const critterSkills = critters[templateId].skills
      skills.base = { ...defaultSkillsValues, ...critterSkills }
    }
    Object.values(skillsMap).forEach(({ id, calc }) => {
      if (!isCritter) {
        skills.base[id] = getModAttribute(innateSymptoms, id, calc(this.special.base))
      }
      skills.up[id] = initUpSkills[id]
      const currWithInnate = getModAttribute(
        innateSymptoms,
        id,
        isCritter ? skills.base[id] : calc(this.special.curr)
      )
      const calcCurr = getModAttribute(symptoms, id, currWithInnate)
      skills.curr[id] = Math.max(calcCurr + skills.up[id], 1)
      skills.mod[id] = skills.curr[id] - skills.base[id] - skills.up[id]
    })
    this.skills = skills

    this.knowledges = payload.knowledges ?? {}
    this.perks = Object.fromEntries(payload.perks?.map(e => [e, e]) ?? [])
    this.traits = Object.fromEntries(payload.traits?.map(e => [e, e]) ?? [])
  }
}
