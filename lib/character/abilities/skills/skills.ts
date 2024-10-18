import { Special } from "../special/special.types"
import { Skill, SkillId } from "./skills.types"

const skillsMap: Record<SkillId, Skill> = {
  melee: {
    id: "melee",
    label: "Armes blanches",
    short: "ArmBla",
    calc: (SPECIAL: Special) => 2 * SPECIAL.strength + 2 * SPECIAL.agility + 10 + SPECIAL.endurance,
    armorMalus: []
  },
  lightMedWeapons: {
    id: "lightMedWeapons",
    label: "Armes lég/moy",
    short: "ArmLég",
    calc: (SPECIAL: Special) => 2 * SPECIAL.agility + 2 * SPECIAL.perception + 5,
    armorMalus: []
  },
  bigGuns: {
    id: "bigGuns",
    label: "Armes lourdes",
    short: "ArmLou",
    calc: (SPECIAL: Special) => 2 * SPECIAL.strength + SPECIAL.endurance + 5,
    armorMalus: []
  },
  unarmed: {
    id: "unarmed",
    label: "Corps à corps",
    short: "CàC",
    calc: (SPECIAL: Special) => 2 * SPECIAL.endurance + 2 * SPECIAL.strength + SPECIAL.agility + 10,
    armorMalus: []
  },
  barter: {
    id: "barter",
    label: "Commerce",
    short: "Comm",
    calc: (SPECIAL: Special) => 5 + SPECIAL.intelligence + SPECIAL.charisma + SPECIAL.luck,
    armorMalus: []
  },
  speech: {
    id: "speech",
    label: "Discours",
    short: "Disc",
    calc: (SPECIAL: Special) => 2 * SPECIAL.charisma + SPECIAL.intelligence + 5,
    armorMalus: []
  },
  stealth: {
    id: "stealth",
    label: "Discrétion (AC)",
    short: "Furt",
    calc: (SPECIAL: Special) => 2 * SPECIAL.agility + 2 * SPECIAL.luck + 10,
    armorMalus: ["torso", "head"]
  },
  throw: {
    id: "throw",
    label: "Lancer (A)",
    short: "Lanc",
    calc: (SPECIAL: Special) => 2 * SPECIAL.agility + 2 * SPECIAL.perception + 10,
    armorMalus: ["torso"]
  },
  manipulation: {
    id: "manipulation",
    label: "Manipulation (A)",
    short: "Manip",
    calc: (SPECIAL: Special) => 2 * SPECIAL.agility + SPECIAL.intelligence + 5,
    armorMalus: ["torso"]
  },
  perceptionSkill: {
    id: "perceptionSkill",
    label: "Perception (C)",
    short: "Perc",
    calc: (SPECIAL: Special) => 4 * SPECIAL.perception + 10 + SPECIAL.intelligence,
    armorMalus: ["head"]
  },
  trap: {
    id: "trap",
    label: "Pièges (AC)",
    short: "Piè",
    calc: (SPECIAL: Special) => 2 * SPECIAL.agility + SPECIAL.perception + 5,
    armorMalus: ["torso", "head"]
  },
  physical: {
    id: "physical",
    label: "Physique (A)",
    short: "Phy",
    calc: (SPECIAL: Special) => 2 * SPECIAL.endurance + 2 * SPECIAL.strength + SPECIAL.agility + 10,
    armorMalus: ["torso"]
  },
  reflexion: {
    id: "reflexion",
    label: "Réflexion",
    short: "Refl",
    calc: (SPECIAL: Special) => 5 * SPECIAL.intelligence + 10,
    armorMalus: []
  },
  aid: {
    id: "aid",
    label: "Soins (AC)",
    short: "Soin",
    calc: (SPECIAL: Special) => 2 * SPECIAL.intelligence + SPECIAL.agility + 5,
    armorMalus: ["torso", "head"]
  },
  survival: {
    id: "survival",
    label: "Survie",
    short: "Surv",
    calc: (SPECIAL: Special) => 2 * SPECIAL.endurance + SPECIAL.intelligence + 5,
    armorMalus: []
  },
  steal: {
    id: "steal",
    label: "Vol (A)",
    short: "Vol",
    calc: (SPECIAL: Special) => 2 * SPECIAL.agility + SPECIAL.luck + 5,
    armorMalus: ["torso"]
  }
}

export default skillsMap
