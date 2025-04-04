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

export type CombatModValues = {
  [key in CombatModId]: number
}

const combatModsMap: Record<CombatModId, CombatMod> = {
  damageResist: {
    id: "damageResist",
    label: "Résistance aux dégâts",
    short: "ResDeg",
    unit: "%"
  },
  damageGiven: {
    id: "damageGiven",
    label: "Dégâts infligés",
    short: "Deg",
    unit: "%"
  },
  physicalDamageResist: {
    id: "physicalDamageResist",
    label: "Résistance aux dégâts physiques",
    short: "ResPhy",
    unit: "%"
  },
  physicalDamageGiven: {
    id: "physicalDamageGiven",
    label: "Dégâts physiques infligés",
    short: "DegPhy",
    unit: "%"
  },
  laserDamageResist: {
    id: "laserDamageResist",
    label: "Résistance aux dégâts laser",
    short: "ResLas",
    unit: "%"
  },
  laserDamageGiven: {
    id: "laserDamageGiven",
    label: "Dégâts laser infligés",
    short: "DegLas",
    unit: "%"
  },
  plasmaDamageResist: {
    id: "plasmaDamageResist",
    label: "Résistance aux dégâts plasma",
    short: "ResPla",
    unit: "%"
  },
  plasmaDamageGiven: {
    id: "plasmaDamageGiven",
    label: "Dégâts plasma infligés",
    short: "DegPla",
    unit: "%"
  },
  fireDamageResist: {
    id: "fireDamageResist",
    label: "Résistance aux dégâts de feu",
    short: "ResFeu",
    unit: "%"
  },
  fireDamageGiven: {
    id: "fireDamageGiven",
    label: "Dégâts de feu infligés",
    short: "DegFeu",
    unit: "%"
  }
}

export default combatModsMap

export const combatModsArray = Object.values(combatModsMap)
