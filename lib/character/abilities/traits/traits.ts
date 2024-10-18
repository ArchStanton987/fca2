import { Trait, TraitId } from "./traits.types"

const traitsMap: Record<TraitId, Trait> = {
  heavy: {
    id: "heavy",
    description:
      "Vous êtes particulièrement fort, mais vous n'êtes pas le plus dynamique en combat.",
    label: "Brute",
    symptoms: [
      { id: "actionPoints", operation: "add", value: -3 },
      { id: "strength", operation: "add", value: 2 }
    ]
  },
  carnage: {
    id: "carnage",
    description:
      "Vous avez une aptitude naturelle à infliger des dégâts. Le problème, c'est que vous en prenez aussi beaucoup.",
    label: "Carnage",
    symptoms: [
      { id: "damageGiven", operation: "mult", value: 2 },
      { id: "damageResist", operation: "mult", value: 0.5 }
    ]
  },
  strongHand: {
    id: "strongHand",
    description:
      "Vous êtes très habile avec votre main dominante, en revanche les choses se compliquent dès que vous devez utiliser votre autre main.",
    label: "Main dominante",
    symptoms: [
      { id: "kOneHandedWeapons", operation: "add", value: 15 },
      { id: "kTwoHandedWeapons", operation: "add", value: -15 }
    ]
  },
  chemReliant: {
    id: "chemReliant",
    description:
      "Vous avez une probabilité plus élevée de devenir accro aux drogues, mais vous supportez mieux les effets négatifs de ces dernières.",
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
    description:
      "Vous êtes capable de frapper fort, mais vos attaques manquent de finesse. Vos dégâts de mélés sont augmentés, mais vous avez moins de chances de réaliser un coup critique.",
    label: "Main lourde",
    symptoms: [
      { id: "critChance", operation: "add", value: -10 },
      { id: "meleeDamage", operation: "add", value: 4 }
    ]
  },
  mrFast: {
    id: "mrFast",
    description:
      "On canarde !!! Et si jamais il faut viser... Mince, fallait le dire avant ! Utiliser une arme vous coûte 1 PA en moins, mais vous êtes incapable de viser.",
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
    description:
      "Votre organisme se soigne très rapidement, mais vous êtes plus sensible aux radiations et aux poisons.",
    label: "Métabolisme rapide",
    symptoms: [
      { id: "poisResist", operation: "abs", value: 0 },
      { id: "radsResist", operation: "abs", value: 0 },
      { id: "healHpPerHour", operation: "abs", value: 8 }
    ]
  },
  finesse: {
    id: "finesse",
    description:
      "Votre chance d'effectuer un coup critique est augmentée, mais vous infligez moins de dégâts.",
    label: "Finesse",
    symptoms: [
      { id: "critChance", operation: "add", value: 20 },
      { id: "damageGiven", operation: "mult", value: 0.5 }
    ]
  },
  smallFrame: {
    id: "smallFrame",
    description:
      "Vous êtes plus agile, mais vous ne pouvez pas transporter autant d'objets que les autres.",
    label: "Petite nature",
    symptoms: [
      { id: "agility", operation: "add", value: 1 },
      { id: "normalCarryWeight", operation: "mult", value: 0.8 },
      { id: "tempCarryWeight", operation: "mult", value: 0.7 },
      { id: "maxCarryWeight", operation: "mult", value: 0.6 }
    ]
  },
  lunatic: {
    id: "lunatic",
    description: "",
    label: "Lunatique",
    symptoms: []
  }
}

export default traitsMap
