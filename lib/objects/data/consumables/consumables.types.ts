import { KnowledgeId } from "lib/character/abilities/knowledges/knowledge-types"
import { SkillId } from "lib/character/abilities/skills/skills.types"
import { EffectId } from "lib/character/effects/effects.types"
import { Modifier } from "lib/character/effects/symptoms.type"

export type DbConsumable = { id: ConsumableId; remainingUse?: number }

export type ConsumableData = {
  id: ConsumableId
  label: string
  effectId: EffectId | null
  challengeLabel: string | null
  od: number | false
  addict: `${number}-${number}` | false
  value: number
  place: number
  weight: number
  description: string
  tags: string[]
  maxUsage: number
  knowledges?: KnowledgeId[]
  skillId?: SkillId
  modifiers?: Modifier[]
}

export type Consumable = {
  id: string
  dbKey: string
  remainingUse?: number
  data: ConsumableData
}

export type ConsumableId =
  | "ration"
  | "healingPowder"
  | "stimpack"
  | "superStimpack"
  | "ultraStimpack"
  | "traumapack"
  | "hypo"
  | "firstAidKit"
  | "pharmaKit"
  | "medecineKit"
  | "interventionKit"
  | "mecaLockpickKit"
  | "superMecaLockpickKit"
  | "electroLockpickKit"
  | "superElectroLockpickKit"
  | "toolbox"
  | "antidote"
  | "radX"
  | "radAway"
  | "voodoo"
  | "amphetagum"
  | "buffout"
  | "mentats"
  | "psycho"
  | "jet"
  | "beer"
  | "caliWine"
  | "hipsterBrew"
  | "banquetWine"
  | "schnaps"
  | "whisky"
  | "rum"
  | "vodka"
  | "homePunch"
  | "twistGut"
  | "stealthboy"
