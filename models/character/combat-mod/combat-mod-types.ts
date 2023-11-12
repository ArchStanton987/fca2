export type CombatModId =
  | "damageResist"
  | "damageGiven"
  | "physicalDamageResist"
  | "physicalDamageGiven"
  | "laserDamageResist"
  | "laserDamageGiven"
  | "plasmaDamageResist"
  | "plasmaDamageGiven"
  | "fireDamageResist"
  | "fireDamageGiven"

export type CombatMod = {
  id: CombatModId
  label: string
  short: string
  unit: string
}
