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
  getBase: (baseSpecial: SpecialValues, traits, perks) => number
}

export type SpecialValues = {
  [key in SpecialId]: number
}
