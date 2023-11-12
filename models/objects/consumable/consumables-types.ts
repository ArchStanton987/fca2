import { EffectId, Modifier } from "models/character/effects/effect-types"
import { KnowledgeId } from "models/character/knowledges/knowledge-types"
import { SkillId } from "models/character/skills/skills-types"

export type Consumable = {
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
