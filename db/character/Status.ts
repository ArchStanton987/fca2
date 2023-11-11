export type CharacterBackground = "vaultDweller" | "jackal"

export type Status = {
  background: CharacterBackground
  caps: number
  exp: number
  level: number

  currAp: number
  groinHp: number
  headHp: number
  leftArmHp: number
  leftTorsoHp: number
  rightTorsoHp: number
  leftLegHp: number
  poison: number
  rads: number
  rightArmHp: number
  rightLegHp: number
}
