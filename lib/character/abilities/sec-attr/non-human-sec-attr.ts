const nonHumanSecAttrMap = {
  critChance: {
    id: "critChance",
    label: "Chance de critique",
    short: "CC",
    unit: "%",
    calc: () => 5
  },
  armorClass: {
    id: "armorClass",
    label: "Classe d'armure",
    short: "CA",
    calc: (t: { armorClass: number }) => t.armorClass
  },
  meleeDamage: {
    id: "meleeDamage",
    label: "Dégâts de mélée",
    short: "DM",
    calc: () => 0
  },
  mentalStrength: {
    id: "mentalStrength",
    label: "Force morale",
    short: "FM",
    calc: () => 1
  },
  actionPoints: {
    id: "actionPoints",
    label: "Points d'action",
    short: "PA",
    calc: (t: { actionPoints: number }) => t.actionPoints
  },
  range: {
    id: "range",
    label: "Portée",
    short: "PO",
    unit: "m",
    calc: () => 20
  },
  poisResist: {
    id: "poisResist",
    label: "Résistance au poison",
    short: "resPoi",
    unit: "%",
    calc: (t: { resistances: { poisResist: number } }) => t.resistances.poisResist
  },
  radsResist: {
    id: "radsResist",
    label: "Résistance aux radiations",
    short: "resRad",
    unit: "%",
    calc: (t: { resistances: { radsResist: number } }) => t.resistances.radsResist
  },
  healHpPerHour: {
    id: "healHpPerHour",
    label: "Régénération des PV",
    short: "HP/h",
    unit: "HP/h",
    calc: () => 1
  },
  maxPlace: {
    id: "maxPlace",
    label: "Place",
    short: "PL",
    calc: () => 0
  },
  normalCarryWeight: {
    id: "normalCarryWeight",
    label: "Port normal",
    short: "PorNor",
    unit: "kg",
    calc: () => 0
  },
  tempCarryWeight: {
    id: "tempCarryWeight",
    label: "Port temporaire",
    short: "PorTemp",
    unit: "kg",
    calc: () => 0
  },
  maxCarryWeight: {
    id: "maxCarryWeight",
    label: "Port max",
    short: "PorMax",
    unit: "kg",
    calc: () => 0
  }
}

export const nonHumanSecAttrArray = Object.values(nonHumanSecAttrMap)

export default nonHumanSecAttrMap
