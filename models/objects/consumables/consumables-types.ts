import { KnowledgeId } from "models/abilities/knowledges/knowledge-types"
import { SkillId } from "models/abilities/skills/skills-types"
import { EffectId, Mod } from "models/effects/effect-types"

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
  mods?: Mod[]
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
