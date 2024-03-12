import { Trait, TraitId } from "./traits.types"

const traitsMap: Record<TraitId, Trait> = {
  heavy: {
    id: "heavy",
    description: "",
    label: "Brute",
    symptoms: [
      { id: "actionPoints", operation: "add", value: -3 },
      { id: "strength", operation: "add", value: 2 }
    ]
  },
  carnage: {
    id: "carnage",
    description: "",
    label: "Carnage",
    symptoms: [
      { id: "damageGiven", operation: "mult", value: 2 },
      { id: "damageResist", operation: "mult", value: 0.5 }
    ]
  },
  strongHand: {
    id: "strongHand",
    description: "",
    label: "Main dominante",
    symptoms: [
      { id: "kOneHandedWeapons", operation: "add", value: 15 },
      { id: "kTwoHandedWeapons", operation: "add", value: -15 }
    ]
  },
  chemReliant: {
    id: "chemReliant",
    description: "",
    label: "Junkie",
    symptoms: [
      // { id: "addictChance", operation: "add", value: 50 },
      // { id: "withDrawLength", operation: "mult", value: 0.5 }
    ]
  },
  berserk: {
    id: "berserk",
    description: "",
    label: "Fou furieux",
    symptoms: []
  },
  glowingOne: {
    id: "glowingOne",
    description: "",
    label: "Luminescent",
    symptoms: []
  },
  kamikaze: {
    id: "kamikaze",
    description: "",
    label: "Kamikaze",
    symptoms: []
  },
  hamHands: {
    id: "hamHands",
    description: "",
    label: "Mains jambon",
    symptoms: []
  },
  bruiser: {
    id: "bruiser",
    description: "",
    label: "Main lourde",
    symptoms: [
      { id: "critChance", operation: "add", value: -10 },
      { id: "meleeDamage", operation: "add", value: 4 }
    ]
  },
  mrFast: {
    id: "mrFast",
    description: "",
    label: "M.Rapide",
    symptoms: []
  },
  jinxed: {
    id: "jinxed",
    description: "",
    label: "Poissard(e)",
    symptoms: []
  },
  nightPeople: {
    id: "nightPeople",
    description: "",
    label: "Noctambule",
    symptoms: []
  },
  peacefull: {
    id: "peacefull",
    description: "",
    label: "Pacifiste",
    symptoms: []
  },
  sexAppeal: {
    id: "sexAppeal",
    description: "",
    label: "Sex appeal",
    symptoms: []
  },
  sm: {
    id: "sm",
    description: "",
    label: "Sadomaso",
    symptoms: []
  },
  talented: {
    id: "talented",
    description: "",
    label: "Talentueux",
    symptoms: []
  },
  skilled: {
    id: "skilled",
    description: "",
    label: "Compétence",
    symptoms: [
      // { id: "compPointsPerLevel", operation: "abs", value: 5 },
      // { id: "levelsForSpec", operation: "add", value: 2 }
    ]
  },
  fastMetabolism: {
    id: "fastMetabolism",
    description: "",
    label: "Métabolisme rapide",
    symptoms: [
      { id: "poisResist", operation: "abs", value: 0 },
      { id: "radsResist", operation: "abs", value: 0 },
      { id: "healHpPerHour", operation: "abs", value: 8 }
    ]
  },
  finesse: {
    id: "finesse",
    description: "",
    label: "Finesse",
    symptoms: [
      { id: "critChance", operation: "add", value: 20 },
      { id: "damageGiven", operation: "mult", value: 0.5 }
    ]
  },
  smallFrame: {
    id: "smallFrame",
    description: "",
    label: "Petite nature",
    symptoms: [{ id: "agility", operation: "add", value: 1 }]
  },
  lunatic: {
    id: "lunatic",
    description: "",
    label: "Lunatique",
    symptoms: []
  }
}

export default traitsMap
