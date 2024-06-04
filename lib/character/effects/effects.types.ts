import { Symptom } from "./symptoms.type"

export type DbEffect = { id: EffectId; startTs?: string; endTs?: string }

export type DbEffects = Record<string, DbEffect>

export type EffectType =
  | "drug"
  | "poison"
  | "withdrawal"
  | "cripled"
  | "healthState"
  | "radState"
  | "other"

export type EffectId =
  | "dirty"
  | "dirtyPlus"
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
  | "woundedTired"
  | "woundedExhausted"
  | "woundedUnconscious"
  | "dead"
  | "vanished"
  | "cripledHead"
  | "cripledLeftArm"
  | "cripledRightArm"
  | "cripledLeftTorso"
  | "cripledRightTorso"
  | "cripledLeftLeg"
  | "cripledRightLeg"
  | "cripledGroin"
  | "radLvl1"
  | "radLvl2"
  | "radLvl3"
  | "radLvl4"
  | "radLvl5"
  | "radLvl6"
  | "poisonMustardGas"
  | "poisonRadRatVenom"
  | "poisonRadScorpionLightVenom"
  | "poisonRadScorpionMedVenom"
  | "poisonRadScorpionStrongVenom"
  | "poisonTribal"
  | "poisonPlantLight"
  | "poisonPlantStrong"

export type EffectData = {
  id: EffectId
  type: EffectType
  label: string
  symptoms: Symptom[]
  length: number | null
  description: string
  od: number | null
  nextEffectId: EffectId | null
}

export type Effect = {
  id: EffectId
  data: EffectData
  dbKey: string
  startTs?: Date
  endTs?: Date
  timeRemaining?: string | null
}
