export type SpecialId =
  | "strength"
  | "perception"
  | "endurance"
  | "charisma"
  | "intelligence"
  | "agility"
  | "luck"

export type Special = Record<SpecialId, number>
