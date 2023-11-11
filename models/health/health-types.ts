export type HealthAttrId =
  | "hp"
  | "headHp"
  | "torsoHp"
  | "leftArmHp"
  | "rightArmHp"
  | "leftLegHp"
  | "rightLegHp"
  | "groinHp"
  | "healHpPerHour"
  | "poison"
  | "rads"
// | "addictChance"
// | "withdrawLength"

export type HealthAttr = {
  [key in HealthAttrId]: number
}
