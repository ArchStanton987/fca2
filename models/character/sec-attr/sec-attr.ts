import { getActionPoints, getRange } from "models/character/sec-attr/sec-attr-utils"

import { SecAttr, SecAttrId } from "./sec-attr-types"

const secAttrMap: Record<SecAttrId, SecAttr> = {
  critChance: {
    id: "critChance",
    label: "Chance de critique",
    short: "CC",
    unit: "%",
    calc: SPECIAL => SPECIAL.luck
    // getMod: () => {},
    // getCurrent: () => {}
  },
  armorClass: {
    id: "armorClass",
    label: "Classe d'armure",
    short: "CA",
    calc: SPECIAL => Math.ceil((SPECIAL.agility + SPECIAL.endurance) / 2)
    // getMod: () => {},
    // getCurrent: () => {}
  },
  meleeDamage: {
    id: "meleeDamage",
    label: "Dégâts de mélée",
    short: "DM",
    calc: SPECIAL => Math.ceil(SPECIAL.strength / 2)
    // getMod: () => {},
    // getCurrent: () => {}
  },
  mentalStrength: {
    id: "mentalStrength",
    label: "Force morale",
    short: "FM",
    calc: SPECIAL => Math.ceil((SPECIAL.charisma + SPECIAL.intelligence) / 2)
    // getMod: () => {},
    // getCurrent: () => {}
  },
  actionPoints: {
    id: "actionPoints",
    label: "Points d'action",
    short: "PA",
    calc: SPECIAL => getActionPoints(SPECIAL.agility)
    // getMod: () => {},
    // getCurrent: () => {}
  },
  range: {
    id: "range",
    label: "Portée",
    short: "PO",
    unit: "m",
    calc: SPECIAL => getRange(SPECIAL.perception)
    // getMod: () => {},
    // getCurrent: () => {}
  },
  poisResist: {
    id: "poisResist",
    label: "Résistance au poison",
    short: "resPoi",
    unit: "%",
    calc: SPECIAL => 5 * SPECIAL.endurance
    // getMod: () => {},
    // getCurrent: () => {}
  },
  radsResist: {
    id: "radsResist",
    label: "Résistance aux radiations",
    short: "resRad",
    unit: "%",
    calc: SPECIAL => 2 * SPECIAL.endurance
    // getMod: () => {},
    // getCurrent: () => {}
  },
  healHpPerHour: {
    id: "healHpPerHour",
    label: "Régénération des PV",
    short: "HP/h",
    unit: "HP/h",
    calc: SPECIAL => SPECIAL.endurance / 2
    // getMod: () => {},
    // getCurrent: () => {}
  },
  maxPlace: {
    id: "maxPlace",
    label: "Place",
    short: "PL",
    calc: () => 20
    // getMod: () => {},
    // getCurrent: () => {}
  },
  normalCarryWeight: {
    id: "normalCarryWeight",
    label: "Port normal",
    short: "PorNor",
    unit: "kg",
    calc: SPECIAL => SPECIAL.strength * 5 + 20
    // getMod: () => {},
    // getCurrent: () => {}
  },
  tempCarryWeight: {
    id: "tempCarryWeight",
    label: "Port temporaire",
    short: "PorTemp",
    unit: "kg",
    calc: SPECIAL => SPECIAL.strength * 10 + 20
    // getMod: () => {},
    // getCurrent: () => {}
  },
  maxCarryWeight: {
    id: "maxCarryWeight",
    label: "Port max",
    short: "PorMax",
    unit: "kg",
    calc: SPECIAL => SPECIAL.strength * 15 + 20
    // getMod: () => {},
    // getCurrent: () => {}
  }
}

export default secAttrMap
