import { Symptom } from "lib/character/effects/symptoms.type"

// TODO: decide if carry items (purse, holster, etc) should be considered as misc objects / clothings
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

export type DbMiscObject = { id: MiscObjectId }

export type MiscObjectData = {
  id: MiscObjectId
  label: string
  description: string
  value: number | "?"
  place: number
  weight: number
  symptoms: Symptom[]
}

export type MiscObject = {
  id: MiscObjectId
  dbKey: string
  data: MiscObjectData
}
