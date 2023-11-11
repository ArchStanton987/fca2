import { KnowledgeId } from "models/abilities/knowledges/knowledge-types"
import { SecAttrId } from "models/abilities/sec-attr/sec-attr-types"
import { SkillId } from "models/abilities/skills/skills-types"
import { SpecialId } from "models/abilities/special/special-types"
import { CombatModId } from "models/combat-mod/combat-mod-types"

export type OperationType = "add" | "mult" | "abs"

export type Symptom = {
  id: SpecialId | SecAttrId | SkillId | CombatModId | KnowledgeId
  operation: OperationType
  value: number
}

export type Mod = Symptom

export type Effect = {
  id: EffectId
  label: string
  symptoms: Symptom[]
  length: number | null
  description: string
  od: number | null
  nextEffectId: EffectId | null
  isWithdrawal: boolean
}

export type EffectId =
  | "cripledHead"
  | "cripledLeftArm"
  | "cripledRightArm"
  | "cripledLeftTorso"
  | "cripledRightTorso"
  | "cripledLeftLeg"
  | "cripledRightLeg"
  | "cripledGroin"
  | "dirty"
  | "dirtyPlus"
  | "tired"
  | "exhausted"
  | "unconscious"
  | "dead"
  | "vanished"
  | "radLvl1"
  | "radLvl2"
  | "radLvl3"
  | "radLvl4"
  | "radLvl5"
  | "radLvl6"
  | "buffout"
  | "psycho"
  | "psycho_withdraw"
  | "mentats"
  | "mentats_withdraw"
  | "jet"
  | "jet_withdraw"
  | "radx"
  | "voodoo"
  | "amphetagum"
  | "alcohol"
  | "fancyAlcohol"
  | "booze"
  | "drunk"
  | "wasted"
  | "alcohol_withdraw"
  | "lunaticPlus"
  | "lunaticMinus"
  | "cheater"
  | "healingPowder"
  | "superStimpack"
  | "ultraStimpack"
  | "traumapack"
