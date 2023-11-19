export type SpecialId =
  | "strength"
  | "perception"
  | "endurance"
  | "charisma"
  | "intelligence"
  | "agility"
  | "luck"

export type SpecialValues = {
  [key in SpecialId]: number
}
