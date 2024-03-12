import { Symptom } from "./symptoms.type"

export type EffectId =
  | "dirty"
  | "dirtyPlus"
  | "tired"
  | "exhausted"
  | "unconscious"
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
