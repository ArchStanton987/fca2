export type BodyPart = "head" | "torso" | "arms" | "groin" | "legs"
export type DbBodyParts = Record<BodyPart, BodyPart>

export type HealthStatusId =
  | "headHp"
  | "leftTorsoHp"
  | "rightTorsoHp"
  | "leftArmHp"
  | "rightArmHp"
  | "leftLegHp"
  | "rightLegHp"
  | "groinHp"
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

export type LimbsHp = {
  headHp: number
  leftTorsoHp: number
  rightTorsoHp: number
  leftArmHp: number
  rightArmHp: number
  leftLegHp: number
  rightLegHp: number
  groinHp: number
}

export type DbLimbsHp = LimbsHp

export type Health = {
  maxHp: number
  missingHp: number
  hp: number
  limbsHp: LimbsHp
  rads: number
}
