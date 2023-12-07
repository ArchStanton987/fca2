export type BodyPart = "head" | "torso" | "arms" | "groin" | "legs"

export type HealthStatusId =
  | "hp"
  | "headHp"
  | "leftTorsoHp"
  | "rightTorsoHp"
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

export type HealthType = {
  id: HealthStatusId
  label: string
  short: string
  minValue: number
  maxValue: number
}
