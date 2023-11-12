import { SecAttr, SecAttrId } from "./sec-attr-types"
import { getActionPoints, getRange } from "./sec-attr-utils"

const secAttr: Record<SecAttrId, SecAttr> = {
  critChance: {
    id: "critChance",
    label: "Chance de critique",
    short: "CC",
    unit: "%",
    calc: SPECIAL => SPECIAL.luck
  },
  armorClass: {
    id: "armorClass",
    label: "Classe d'armure",
    short: "CA",
    calc: SPECIAL => Math.ceil((SPECIAL.agility + SPECIAL.endurance) / 2)
  },
  meleeDamage: {
    id: "meleeDamage",
    label: "Dégâts de mélée",
    short: "DM",
    calc: SPECIAL => Math.ceil(SPECIAL.strength / 2)
  },
  mentalStrength: {
    id: "mentalStrength",
    label: "Force morale",
    short: "FM",
    calc: SPECIAL => Math.ceil((SPECIAL.charisma + SPECIAL.intelligence) / 2)
  },
  actionPoints: {
    id: "actionPoints",
    label: "Points d'action",
    short: "PA",
    calc: SPECIAL => getActionPoints(SPECIAL.agility)
  },
  range: {
    id: "range",
    label: "Portée",
    short: "PO",
    unit: "m",
    calc: SPECIAL => getRange(SPECIAL.perception)
  },
  poisResist: {
    id: "poisResist",
    label: "Résistance au poison",
    short: "resPoi",
    unit: "%",
    calc: SPECIAL => 5 * SPECIAL.endurance
  },
  radsResist: {
    id: "radsResist",
    label: "Résistance aux radiations",
    short: "resRad",
    unit: "%",
    calc: SPECIAL => 2 * SPECIAL.endurance
  },
  healHpPerHour: {
    id: "healHpPerHour",
    label: "Régénération des PV",
    short: "HP/h",
    unit: "HP/h",
    calc: SPECIAL => SPECIAL.endurance / 2
  },
  place: {
    id: "place",
    label: "Place",
    short: "PL",
    calc: (SPECIAL, traits, perks) => SPECIAL.strength * 10
  }
}

export default secAttr
