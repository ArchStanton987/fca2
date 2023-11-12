export type BodyPart = "head" | "torso" | "arms" | "groin" | "legs"

export type HealthStatusId =
  | "hp"
  | "headHp"
  | "torsoHp"
  | "leftArmHp"
  | "rightArmHp"
  | "leftLegHp"
  | "rightLegHp"
  | "groinHp"
  | "poison"
  | "rads"

export type HealthStatus = {
  [key in HealthStatusId]: number
}
