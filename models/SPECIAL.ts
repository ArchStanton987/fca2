export type SpecialIdType = "strength" | "perception" | "endurance" | "charisma" | "intelligence" | "agility" | "luck";

export type SPECIALType = {
  [key in SpecialIdType]: number;
}