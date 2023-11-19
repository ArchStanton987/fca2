import { SecAttr, SecAttrId } from "./sec-attr-types"

// import { getActionPoints, getRange } from "./sec-attr-utils"

const secAttr: Record<SecAttrId, SecAttr> = {
  critChance: {
    id: "critChance",
    label: "Chance de critique",
    short: "CC",
    unit: "%"
    // getBase: primAttr => SPECIAL.luck,
    // getMod: () => {},
    // getCurrent: () => {}
  },
  armorClass: {
    id: "armorClass",
    label: "Classe d'armure",
    short: "CA"
    // getBase: primAttr => Math.ceil((SPECIAL.agility + SPECIAL.endurance) / 2),
    // getMod: () => {},
    // getCurrent: () => {}
  },
  meleeDamage: {
    id: "meleeDamage",
    label: "Dégâts de mélée",
    short: "DM"
    // getBase: primAttr => Math.ceil(SPECIAL.strength / 2),
    // getMod: () => {},
    // getCurrent: () => {}
  },
  mentalStrength: {
    id: "mentalStrength",
    label: "Force morale",
    short: "FM"
    // getBase: primAttr => Math.ceil((SPECIAL.charisma + SPECIAL.intelligence) / 2),
    // getMod: () => {},
    // getCurrent: () => {}
  },
  actionPoints: {
    id: "actionPoints",
    label: "Points d'action",
    short: "PA"
    // getBase: primAttr => getActionPoints(SPECIAL.agility),
    // getMod: () => {},
    // getCurrent: () => {}
  },
  range: {
    id: "range",
    label: "Portée",
    short: "PO",
    unit: "m"
    // getBase: primAttr => getRange(SPECIAL.perception),
    // getMod: () => {},
    // getCurrent: () => {}
  },
  poisResist: {
    id: "poisResist",
    label: "Résistance au poison",
    short: "resPoi",
    unit: "%"
    // getBase: primAttr => 5 * SPECIAL.endurance,
    // getMod: () => {},
    // getCurrent: () => {}
  },
  radsResist: {
    id: "radsResist",
    label: "Résistance aux radiations",
    short: "resRad",
    unit: "%"
    // getBase: primAttr => 2 * SPECIAL.endurance,
    // getMod: () => {},
    // getCurrent: () => {}
  },
  healHpPerHour: {
    id: "healHpPerHour",
    label: "Régénération des PV",
    short: "HP/h",
    unit: "HP/h"
    // getBase: primAttr => SPECIAL.endurance / 2,
    // getMod: () => {},
    // getCurrent: () => {}
  },
  maxPlace: {
    id: "maxPlace",
    label: "Place",
    short: "PL"
    // getBase: primAttr => 20,
    // getMod: () => {},
    // getCurrent: () => {}
  },
  normalCarryWeight: {
    id: "normalCarryWeight",
    label: "Port normal",
    short: "PorNor",
    unit: "kg"
    // getBase: primAttr => SPECIAL.strength * 5 + 20,
    // getMod: () => {},
    // getCurrent: () => {}
  },
  tempCarryWeight: {
    id: "tempCarryWeight",
    label: "Port temporaire",
    short: "PorTemp",
    unit: "kg"
    // getBase: primAttr => SPECIAL.strength * 10 + 20,
    // getMod: () => {},
    // getCurrent: () => {}
  },
  maxCarryWeight: {
    id: "maxCarryWeight",
    label: "Port max",
    short: "PorMax",
    unit: "kg"
    // getBase: primAttr => SPECIAL.strength * 15 + 20,
    // getMod: () => {},
    // getCurrent: () => {}
  }
}

export default secAttr
