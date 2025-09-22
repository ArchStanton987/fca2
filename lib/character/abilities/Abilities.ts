import { getModAttribute } from "lib/common/utils/char-calc"

import { Symptom } from "../effects/symptoms.type"
import { DbAbilities } from "./abilities.types"
import { KnowledgeId, KnowledgeLevelValue } from "./knowledges/knowledge-types"
import { PerkId } from "./perks/perks.types"
import { secAttrArray } from "./sec-attr/sec-attr"
import { SecAttrsValues } from "./sec-attr/sec-attr-types"
import skillsMap from "./skills/skills"
import { SkillsValues } from "./skills/skills.types"
import { specialArray } from "./special/special"
import { Special } from "./special/special.types"
import { TraitId } from "./traits/traits.types"

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

  constructor(payload: DbAbilities, innateSymptoms: Symptom[], itemsSymptoms: Symptom[]) {
    const special = { base: {}, mod: {}, curr: {} } as {
      base: Special
      mod: Special
      curr: Special
    }
    specialArray.forEach(({ id }) => {
      special.base[id] = getModAttribute(innateSymptoms, id, payload.baseSPECIAL[id])
      special.curr[id] = getModAttribute(itemsSymptoms, id, special.base[id])
      special.mod[id] = special.curr[id] - special.base[id]
    })
    this.special = special

    const secAttr = { base: {}, mod: {}, curr: {} } as {
      base: SecAttrsValues
      mod: SecAttrsValues
      curr: SecAttrsValues
    }
    secAttrArray.forEach(({ id, calc }) => {
      secAttr.base[id] = getModAttribute(innateSymptoms, id, calc(this.special.base))
      const currWithInnate = getModAttribute(innateSymptoms, id, calc(this.special.curr))
      secAttr.curr[id] = getModAttribute(itemsSymptoms, id, currWithInnate)
      secAttr.mod[id] = secAttr.curr[id] - secAttr.base[id]
    })
    this.secAttr = secAttr

    const skills = { base: {}, up: {}, mod: {}, curr: {} } as {
      base: SkillsValues
      up: SkillsValues
      mod: SkillsValues
      curr: SkillsValues
    }
    Object.values(skillsMap).forEach(({ id, calc }) => {
      skills.base[id] = getModAttribute(innateSymptoms, id, calc(this.special.base))
      skills.up[id] = payload.upSkills[id]
      const currWithInnate = getModAttribute(innateSymptoms, id, calc(this.special.curr))
      const calcCurr = getModAttribute(itemsSymptoms, id, currWithInnate)
      skills.curr[id] = Math.max(calcCurr + skills.up[id], 1)
      skills.mod[id] = skills.curr[id] - skills.base[id] - skills.up[id]
    })
    this.skills = skills

    this.knowledges = payload.knowledges ?? {}
    this.perks = payload.perks ?? {}
    this.traits = payload.traits ?? {}
  }
}
