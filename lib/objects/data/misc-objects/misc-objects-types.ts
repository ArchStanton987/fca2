import { Symptom } from "lib/character/effects/symptoms.type"

export type MiscObjectId =
  | "brahmin"
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
  | "nukieNukaCola"

export type MiscObjectData = {
  id: MiscObjectId
  label: string
  description: string
  value: number
  place: number
  weight: number
  symptoms: Symptom[]
}

export type DbMiscObjectData = {
  id: MiscObjectId
  label: string
  description: string
  value: number
  place: number
  weight: number
  symptoms: Record<string, Symptom>
}

// export type MiscObject = {
//   id: MiscObjectId
//   dbKey: string
//   category: "misc"
//   data: MiscObjectData
// }
