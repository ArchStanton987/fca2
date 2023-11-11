export type SpecialId =
  | "strength"
  | "perception"
  | "endurance"
  | "charisma"
  | "intelligence"
  | "agility"
  | "luck"

export type Special = {
  id: SpecialId
  label: string
  short: string
  description: string
}

export type SpecialValues = {
  [key in SpecialId]: number
}
