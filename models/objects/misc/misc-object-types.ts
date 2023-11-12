import { Symptom } from "models/character/effects/effect-types"

export type MiscObjectId =
  | "brahmin"
  | "militaryBelt"
  | "holster"
  | "purse"
  | "backpack"
  | "militaryBackpack"
  | "ballgag"
  | "condomBox"
  | "sardinesCan"
  | "boots"
  | "glassBottle"
  | "papysBusinessCard"
  | "rope"
  | "catsPaw"
  | "handcuffs"
  | "smellyGoldenWatch"
  | "canOpener"
  | "pipboy"
  | "alarmClock"
  | "bottomSculpture"
  | "tape"

export type MiscObject = {
  id: MiscObjectId
  label: string
  description: string
  value: number | "?"
  place: number
  weight: number
  symptoms: Symptom[]
}
