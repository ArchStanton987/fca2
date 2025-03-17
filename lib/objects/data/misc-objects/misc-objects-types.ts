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

export type DbMiscObject = { id: MiscObjectId }

export type MiscObjectData = {
  id: MiscObjectId
  label: string
  description: string
  value: number
  place: number
  weight: number
}

export type DbMiscObjectData = {
  id: string
  label: string
  description: string
  value: number
  place: number
  weight: number
}

export type MiscObject = {
  id: MiscObjectId
  dbKey: string
  data: MiscObjectData
}
