import { Effect, EffectId } from "./effect-types"

const effectsMap: Record<EffectId, Effect> = {
  cripledHead: {
    id: "cripledHead",
    label: "Infirme (tête)",
    symptoms: [],
    length: null,
    isWithdrawal: false,
    description:
      "Vous avez pris de vilains coups dans la mouille. Vos capacités cognitives et sensorielles sont clairement dégradées.",
    od: null,
    nextEffectId: null
  },
  cripledLeftArm: {
    id: "cripledLeftArm",
    label: "Infirme (bras gauche)",
    symptoms: [],
    length: null,
    isWithdrawal: false,
    description: "Aïe ! Outre la douleur, vous ne pouvez plus utiliser votre bras gauche.",
    od: null,
    nextEffectId: null
  },
  cripledRightArm: {
    id: "cripledRightArm",
    label: "Infirme (bras droit)",
    symptoms: [],
    length: null,
    isWithdrawal: false,
    description: "Aïe ! Outre la douleur, vous ne pouvez plus utiliser votre bras droit.",
    od: null,
    nextEffectId: null
  },
  cripledLeftTorso: {
    id: "cripledLeftTorso",
    label: "Infirme (torse gauche)",
    symptoms: [],
    length: null,
    isWithdrawal: false,
    description:
      "Ouhh ! Vous avez dû manger sévère, vous avez proablement au moins une côte pétée ! Vous êtes douloureux et essouflé.",
    od: null,
    nextEffectId: null
  },
  cripledRightTorso: {
    id: "cripledRightTorso",
    label: "Infirme (torse droit)",
    symptoms: [],
    length: null,
    isWithdrawal: false,
    description:
      "Ouhh ! Vous avez dû manger sévère, vous avez proablement au moins une côte pétée ! Vous êtes douloureux et essouflé.",
    od: null,
    nextEffectId: null
  },
  cripledLeftLeg: {
    id: "cripledLeftLeg",
    label: "Infirme (jambe gauche)",
    symptoms: [],
    length: null,
    isWithdrawal: false,
    description:
      "Aïe ! Outre la douleur, vous ne pouvez plus utiliser votre jambe gauche. En combat, les déplacements vous coûtent le double de points d'actions.",
    od: null,
    nextEffectId: null
  },
  cripledRightLeg: {
    id: "cripledRightLeg",
    label: "Infirme (jambe droite)",
    symptoms: [],
    length: null,
    isWithdrawal: false,
    description:
      "Aïe ! Outre la douleur, vous ne pouvez plus utiliser votre jambe droite. En combat, les déplacements vous coûtent le double de points d'actions.",
    od: null,
    nextEffectId: null
  },
  cripledGroin: {
    id: "cripledGroin",
    label: "Infirme (entrejambe)",
    symptoms: [],
    length: null,
    isWithdrawal: false,
    description:
      "Bon dieu que ça fait mal ! Quand vous réussirez à vous relever, vous aurez sûrement du mal à vous déplacer.",
    od: null,
    nextEffectId: null
  },
  dirty: {
    id: "dirty",
    label: "Crado",
    symptoms: [
      { id: "barter", operation: "add", value: -10 },
      { id: "speech", operation: "add", value: -10 }
    ],
    length: null,
    isWithdrawal: false,
    description:
      "Même si les standards d'hygiène ne sont pas très élevés dans les terres désolés, vous ne les atteignez pas. Vous avez l'air assez sale et laissez une empreinte olfactive perceptible.",
    od: null,
    nextEffectId: null
  },
  dirtyPlus: {
    id: "dirtyPlus",
    label: "Cradingue",
    symptoms: [
      { id: "barter", operation: "add", value: -20 },
      { id: "speech", operation: "add", value: -20 },
      { id: "stealth", operation: "add", value: -10 },
      { id: "aid", operation: "add", value: -20 }
    ],
    length: null,
    isWithdrawal: false,
    description: `Vous êtes cradingue, avec tout ce que cela implique en terme d'apparence et de senteurs. Dans un environnement faiblement olfactif, vous perdrez en discrétion. Les humains "normaux" ne semblent pas enchantés de discuter avec vous...`,
    od: null,
    nextEffectId: null
  },
  tired: {
    id: "tired",
    label: "Essoufflé",
    symptoms: [
      { id: "blunt", operation: "add", value: -10 },
      { id: "lightMedWeapons", operation: "add", value: -10 },
      { id: "heavyWeapons", operation: "add", value: -10 },
      { id: "unarmed", operation: "add", value: -10 },
      { id: "barter", operation: "add", value: -10 },
      { id: "speech", operation: "add", value: -10 },
      { id: "stealth", operation: "add", value: -10 },
      { id: "throw", operation: "add", value: -10 },
      { id: "manipulation", operation: "add", value: -10 },
      { id: "perceptionSkill", operation: "add", value: -10 },
      { id: "trap", operation: "add", value: -10 },
      { id: "physical", operation: "add", value: -10 },
      { id: "reflexion", operation: "add", value: -10 },
      { id: "aid", operation: "add", value: -10 },
      { id: "survival", operation: "add", value: -10 },
      { id: "steal", operation: "add", value: -10 }
    ],
    length: null,
    isWithdrawal: false,
    description:
      "Vous avez le souffle bien court, cela vous rend fébrile et vous avez aussi du mal à vous concentrer.",
    od: null,
    nextEffectId: null
  },
  exhausted: {
    id: "exhausted",
    label: "Epuisé",
    symptoms: [
      { id: "blunt", operation: "add", value: -30 },
      { id: "lightMedWeapons", operation: "add", value: -30 },
      { id: "heavyWeapons", operation: "add", value: -30 },
      { id: "unarmed", operation: "add", value: -30 },
      { id: "barter", operation: "add", value: -30 },
      { id: "speech", operation: "add", value: -30 },
      { id: "stealth", operation: "add", value: -30 },
      { id: "throw", operation: "add", value: -30 },
      { id: "manipulation", operation: "add", value: -30 },
      { id: "perceptionSkill", operation: "add", value: -30 },
      { id: "trap", operation: "add", value: -30 },
      { id: "physical", operation: "add", value: -30 },
      { id: "reflexion", operation: "add", value: -30 },
      { id: "aid", operation: "add", value: -30 },
      { id: "survival", operation: "add", value: -30 },
      { id: "steal", operation: "add", value: -30 }
    ],
    length: null,
    isWithdrawal: false,
    description:
      "Vous êtes mal en point. Chaque geste, chaque action demande un effort considérable.",
    od: null,
    nextEffectId: null
  },
  unconscious: {
    id: "unconscious",
    label: "Inconscient",
    symptoms: [
      { id: "blunt", operation: "add", value: -200 },
      { id: "lightMedWeapons", operation: "add", value: -200 },
      { id: "heavyWeapons", operation: "add", value: -200 },
      { id: "unarmed", operation: "add", value: -200 },
      { id: "barter", operation: "add", value: -200 },
      { id: "speech", operation: "add", value: -200 },
      { id: "stealth", operation: "add", value: -200 },
      { id: "throw", operation: "add", value: -200 },
      { id: "manipulation", operation: "add", value: -200 },
      { id: "perceptionSkill", operation: "add", value: -200 },
      { id: "trap", operation: "add", value: -200 },
      { id: "physical", operation: "add", value: -200 },
      { id: "reflexion", operation: "add", value: -200 },
      { id: "aid", operation: "add", value: -200 },
      { id: "survival", operation: "add", value: -200 },
      { id: "steal", operation: "add", value: -200 }
    ],
    length: null,
    isWithdrawal: false,
    description:
      "Vous êtes inconscient, d'ailleurs vous n'êtes normalement pas en capacité de lire ceci. Si personne ne vous soigne avant le nombre d'heures qui correspond à votre endurance, vous allez probablement y rester.",
    od: null,
    nextEffectId: null
  },
  dead: {
    id: "dead",
    label: "Mort",
    symptoms: [
      { id: "blunt", operation: "add", value: -200 },
      { id: "lightMedWeapons", operation: "add", value: -200 },
      { id: "heavyWeapons", operation: "add", value: -200 },
      { id: "unarmed", operation: "add", value: -200 },
      { id: "barter", operation: "add", value: -200 },
      { id: "speech", operation: "add", value: -200 },
      { id: "stealth", operation: "add", value: -200 },
      { id: "throw", operation: "add", value: -200 },
      { id: "manipulation", operation: "add", value: -200 },
      { id: "perceptionSkill", operation: "add", value: -200 },
      { id: "trap", operation: "add", value: -200 },
      { id: "physical", operation: "add", value: -200 },
      { id: "reflexion", operation: "add", value: -200 },
      { id: "aid", operation: "add", value: -200 },
      { id: "survival", operation: "add", value: -200 },
      { id: "steal", operation: "add", value: -200 }
    ],
    length: null,
    isWithdrawal: false,
    description:
      "Vous êtes mort, tout au moins cliniquement. Peut-être que le MJ peut vous accorder un jet de sauvegarde contre la mort s'il estime que vous avez une chance de vous sortir de ce qui vous est arrivé.",
    od: null,
    nextEffectId: null
  },
  vanished: {
    id: "vanished",
    label: "Vaporisé",
    symptoms: [
      { id: "blunt", operation: "add", value: -200 },
      { id: "lightMedWeapons", operation: "add", value: -200 },
      { id: "heavyWeapons", operation: "add", value: -200 },
      { id: "unarmed", operation: "add", value: -200 },
      { id: "barter", operation: "add", value: -200 },
      { id: "speech", operation: "add", value: -200 },
      { id: "stealth", operation: "add", value: -200 },
      { id: "throw", operation: "add", value: -200 },
      { id: "manipulation", operation: "add", value: -200 },
      { id: "perceptionSkill", operation: "add", value: -200 },
      { id: "trap", operation: "add", value: -200 },
      { id: "physical", operation: "add", value: -200 },
      { id: "reflexion", operation: "add", value: -200 },
      { id: "aid", operation: "add", value: -200 },
      { id: "survival", operation: "add", value: -200 },
      { id: "steal", operation: "add", value: -200 }
    ],
    length: null,
    isWithdrawal: false,
    description:
      "Si vous voyez ceci, c'est que votre mort a été violente... TRES violente ! Vos avez été propablement vaporisé, liquéfié ou réduit littéralement en bouillie. La seule chose qu'il reste de vous, ce sont des souvenirs. Avez-vous marqué l'Histoire ?",
    od: null,
    nextEffectId: null
  },
  radLvl1: {
    id: "radLvl1",
    label: "Irradié (niv1)",
    symptoms: [
      { id: "blunt", operation: "add", value: -5 },
      { id: "lightMedWeapons", operation: "add", value: -5 },
      { id: "heavyWeapons", operation: "add", value: -5 },
      { id: "unarmed", operation: "add", value: -5 },
      { id: "barter", operation: "add", value: -5 },
      { id: "speech", operation: "add", value: -5 },
      { id: "stealth", operation: "add", value: -5 },
      { id: "throw", operation: "add", value: -5 },
      { id: "manipulation", operation: "add", value: -5 },
      { id: "perceptionSkill", operation: "add", value: -5 },
      { id: "trap", operation: "add", value: -5 },
      { id: "physical", operation: "add", value: -5 },
      { id: "reflexion", operation: "add", value: -5 },
      { id: "aid", operation: "add", value: -5 },
      { id: "survival", operation: "add", value: -5 },
      { id: "steal", operation: "add", value: -5 }
    ],
    length: null,
    isWithdrawal: false,
    description: "Vous vous sentez un peu faible et fatigué.",
    od: null,
    nextEffectId: null
  },
  radLvl2: {
    id: "radLvl2",
    label: "Irradié (niv2)",
    symptoms: [
      { id: "blunt", operation: "add", value: -10 },
      { id: "lightMedWeapons", operation: "add", value: -10 },
      { id: "heavyWeapons", operation: "add", value: -10 },
      { id: "unarmed", operation: "add", value: -10 },
      { id: "barter", operation: "add", value: -10 },
      { id: "speech", operation: "add", value: -10 },
      { id: "stealth", operation: "add", value: -10 },
      { id: "throw", operation: "add", value: -10 },
      { id: "manipulation", operation: "add", value: -10 },
      { id: "perceptionSkill", operation: "add", value: -10 },
      { id: "trap", operation: "add", value: -10 },
      { id: "physical", operation: "add", value: -10 },
      { id: "reflexion", operation: "add", value: -10 },
      { id: "aid", operation: "add", value: -10 },
      { id: "survival", operation: "add", value: -10 },
      { id: "steal", operation: "add", value: -10 }
    ],
    length: null,
    isWithdrawal: false,
    description:
      "Vous êtes mal, vous vous sentez douloureux. En plus, des taches comme des coups de soleil apparaissent sur votre peau.",
    od: null,
    nextEffectId: null
  },
  radLvl3: {
    id: "radLvl3",
    label: "Irradié (niv3)",
    symptoms: [
      { id: "blunt", operation: "add", value: -15 },
      { id: "lightMedWeapons", operation: "add", value: -15 },
      { id: "heavyWeapons", operation: "add", value: -15 },
      { id: "unarmed", operation: "add", value: -15 },
      { id: "barter", operation: "add", value: -15 },
      { id: "speech", operation: "add", value: -15 },
      { id: "stealth", operation: "add", value: -15 },
      { id: "throw", operation: "add", value: -15 },
      { id: "manipulation", operation: "add", value: -15 },
      { id: "perceptionSkill", operation: "add", value: -15 },
      { id: "trap", operation: "add", value: -15 },
      { id: "physical", operation: "add", value: -15 },
      { id: "reflexion", operation: "add", value: -15 },
      { id: "aid", operation: "add", value: -15 },
      { id: "survival", operation: "add", value: -15 },
      { id: "steal", operation: "add", value: -15 }
    ],
    length: null,
    isWithdrawal: false,
    description:
      "Vous êtes empoisonné. Physiquement diminué, vos cheveux tombent. Je ne vous parle pas de ce qui arriverait à vos enfants si vous vous décidiez à procréer dans votre état.",
    od: null,
    nextEffectId: null
  },
  radLvl4: {
    id: "radLvl4",
    label: "Irradié (niv4)",
    symptoms: [
      { id: "blunt", operation: "add", value: -30 },
      { id: "lightMedWeapons", operation: "add", value: -30 },
      { id: "heavyWeapons", operation: "add", value: -30 },
      { id: "unarmed", operation: "add", value: -30 },
      { id: "barter", operation: "add", value: -30 },
      { id: "speech", operation: "add", value: -30 },
      { id: "stealth", operation: "add", value: -30 },
      { id: "throw", operation: "add", value: -30 },
      { id: "manipulation", operation: "add", value: -30 },
      { id: "perceptionSkill", operation: "add", value: -30 },
      { id: "trap", operation: "add", value: -30 },
      { id: "physical", operation: "add", value: -30 },
      { id: "reflexion", operation: "add", value: -30 },
      { id: "aid", operation: "add", value: -30 },
      { id: "survival", operation: "add", value: -30 },
      { id: "steal", operation: "add", value: -30 }
    ],
    length: null,
    isWithdrawal: false,
    description:
      "Vous avez fréquemment des vomissements et des diarrhées. Vous avez des plaies ouvertes sur le corps. Vos muscles, vos os vous causent des douleurs. La nuit vous commencez à luire.",
    od: null,
    nextEffectId: null
  },
  radLvl5: {
    id: "radLvl5",
    label: "Irradié (niv5)",
    symptoms: [
      { id: "blunt", operation: "add", value: -50 },
      { id: "lightMedWeapons", operation: "add", value: -50 },
      { id: "heavyWeapons", operation: "add", value: -50 },
      { id: "unarmed", operation: "add", value: -50 },
      { id: "barter", operation: "add", value: -50 },
      { id: "speech", operation: "add", value: -50 },
      { id: "stealth", operation: "add", value: -50 },
      { id: "throw", operation: "add", value: -50 },
      { id: "manipulation", operation: "add", value: -50 },
      { id: "perceptionSkill", operation: "add", value: -50 },
      { id: "trap", operation: "add", value: -50 },
      { id: "physical", operation: "add", value: -50 },
      { id: "reflexion", operation: "add", value: -50 },
      { id: "aid", operation: "add", value: -50 },
      { id: "survival", operation: "add", value: -50 },
      { id: "steal", operation: "add", value: -50 }
    ],
    length: null,
    isWithdrawal: false,
    description:
      "Vous vomissez du sang, vous n'avez plus de cheveux. Il ne vous reste que votre score d'endurance x 5 heures à vivre si vous ne trouvez pas rapidement un médecin ou ne prenez pas les produits appropriés.",
    od: null,
    nextEffectId: null
  },
  radLvl6: {
    id: "radLvl6",
    label: "Irradié (niv6)",
    symptoms: [
      { id: "blunt", operation: "add", value: -200 },
      { id: "lightMedWeapons", operation: "add", value: -200 },
      { id: "heavyWeapons", operation: "add", value: -200 },
      { id: "unarmed", operation: "add", value: -200 },
      { id: "barter", operation: "add", value: -200 },
      { id: "speech", operation: "add", value: -200 },
      { id: "stealth", operation: "add", value: -200 },
      { id: "throw", operation: "add", value: -200 },
      { id: "manipulation", operation: "add", value: -200 },
      { id: "perceptionSkill", operation: "add", value: -200 },
      { id: "trap", operation: "add", value: -200 },
      { id: "physical", operation: "add", value: -200 },
      { id: "reflexion", operation: "add", value: -200 },
      { id: "aid", operation: "add", value: -200 },
      { id: "survival", operation: "add", value: -200 },
      { id: "steal", operation: "add", value: -200 }
    ],
    length: null,
    isWithdrawal: false,
    description:
      "Vous êtes dans le coma et sur le point de mourir. Il ne vous reste que quelques heures. Vous avez des lésios internes et externes si sérieuses que vous êtes désormais incurable.",
    od: null,
    nextEffectId: null
  },
  buffout: {
    id: "buffout",
    label: "Buffout",
    symptoms: [{ id: "endurance", operation: "add", value: 3 }],
    length: 6,
    isWithdrawal: false,
    od: 5,
    description:
      "Un petit cacheton inventé avant la grande guerre... Cela permettait aux soldats de tenir le coup en mission vachement plus longtemps.",
    nextEffectId: null
  },
  psycho: {
    id: "psycho",
    label: "Psycho",
    symptoms: [
      { id: "agility", operation: "add", value: 3 },
      { id: "armorClass", operation: "add", value: 3 }
    ],
    length: 4,
    isWithdrawal: false,
    od: 2,
    nextEffectId: "psycho_withdraw",
    description:
      "Encore un truc inventé par l'armée pour maximiser le potentiel de combat de la personne s'en injectant. Attention, cela rend carrément vénère ! Il parait même qu'une fois un gars qui en a trop pris s'est lui même dévoré le bras !"
  },
  psycho_withdraw: {
    id: "psycho_withdraw",
    label: "Descente(Psycho)",
    symptoms: [{ id: "intelligence", operation: "add", value: -3 }],
    length: 4,
    isWithdrawal: true,
    description: "Le psycho, quand ça descend, on va dire qu'il vaut mieux ne pas trop en faire !",
    od: null,
    nextEffectId: null
  },
  mentats: {
    id: "mentats",
    label: "Mentats",
    symptoms: [
      { id: "perception", operation: "add", value: 2 },
      { id: "intelligence", operation: "add", value: 4 }
    ],
    length: 12,
    isWithdrawal: false,
    od: 5,
    nextEffectId: "mentats_withdraw",
    description:
      "Une superbe invention pour booster son potentiel intellectuel. Apprécié des scientifiques, des étudiants... et de pas mal de monde ! Même si l'emballage est coloré, ce ne sont pas des bonbons !"
  },
  mentats_withdraw: {
    id: "mentats_withdraw",
    label: "Descente(Mentats)",
    symptoms: [
      { id: "intelligence", operation: "add", value: -4 },
      { id: "perception", operation: "add", value: -4 }
    ],
    length: 24,
    isWithdrawal: true,
    description:
      "Vous vous sentez... Fatigué, inapte et confus. C'est forcément un contre coup de quelque chose...",
    od: null,
    nextEffectId: null
  },
  jet: {
    id: "jet",
    label: "Jet",
    symptoms: [
      { id: "strength", operation: "add", value: 3 },
      { id: "actionPoints", operation: "add", value: 2 }
    ],
    length: 12,
    isWithdrawal: false,
    od: 2,
    nextEffectId: "jet_withdraw",
    description: "JAILAJIGA PATATAAAAATE !!!"
  },
  jet_withdraw: {
    id: "jet_withdraw",
    label: "Descente(Jet)",
    symptoms: [
      { id: "strength", operation: "add", value: -3 },
      { id: "actionPoints", operation: "add", value: -4 }
    ],
    length: 12,
    isWithdrawal: true,
    description: "Vous êtes tout blanc. Vos gestes sont saccadés et vous avez la tremblote.",
    od: null,
    nextEffectId: null
  },
  radx: {
    id: "radx",
    label: "Rad-X",
    symptoms: [{ id: "radsResist", operation: "mult", value: 1.5 }],
    length: 24,
    isWithdrawal: false,
    description: "Une belle invention pour affronter les terres désolées !",
    od: null,
    nextEffectId: null
  },
  voodoo: {
    id: "voodoo",
    label: "Voodoo",
    symptoms: [
      { id: "agility", operation: "add", value: 2 },
      { id: "luck", operation: "add", value: 2 }
    ],
    length: 12,
    isWithdrawal: false,
    od: 3,
    description: "Vous vous sentez très tonique, en parfaite conscience de votre corps !",
    nextEffectId: null
  },
  amphetagum: {
    id: "amphetagum",
    label: "Amphétagum",
    symptoms: [
      { id: "strength", operation: "add", value: 1 },
      { id: "perception", operation: "add", value: 1 }
    ],
    length: 12,
    isWithdrawal: false,
    od: 3,
    description:
      "Vos sens et votre système nerveux sont bien stimulés. Vous êtes un peu agité aussi...",
    nextEffectId: null
  },
  alcohol: {
    id: "alcohol",
    label: "Alcool",
    symptoms: [
      { id: "strength", operation: "add", value: 1 },
      { id: "charisma", operation: "add", value: 1 },
      { id: "perception", operation: "add", value: -1 }
    ],
    length: 1,
    isWithdrawal: false,
    od: 20,
    description: "Vous avez bu un petit coup, et cela commence à faire effet.",
    nextEffectId: null
  },
  fancyAlcohol: {
    id: "fancyAlcohol",
    label: "Alcool(Premier choix)",
    symptoms: [
      { id: "charisma", operation: "add", value: 1 },
      { id: "barter", operation: "add", value: 10 },
      { id: "speech", operation: "add", value: 10 }
    ],
    length: 1,
    isWithdrawal: false,
    od: null,
    description: "Boire des choses rares et raffinées vous inspire...!",
    nextEffectId: null
  },
  booze: {
    id: "booze",
    label: "Alcool(Vitriole)",
    symptoms: [
      { id: "strength", operation: "add", value: 1 },
      { id: "perception", operation: "add", value: -1 },
      { id: "barter", operation: "add", value: -10 },
      { id: "speech", operation: "add", value: -10 }
    ],
    length: 1,
    isWithdrawal: false,
    od: 10,
    description:
      "Disons le, c'était pas très bon. Aucune idée d'avec quoi c'est fait. En tout cas, la vache ce que c'est fort !!! Penser à ne pas trop s'éloigner des comidités...",
    nextEffectId: null
  },
  drunk: {
    id: "drunk",
    label: "Chaud aux oreilles",
    symptoms: [
      { id: "damageResist", operation: "mult", value: 1.15 },
      { id: "intelligence", operation: "add", value: -2 },
      { id: "perception", operation: "add", value: -1 },
      { id: "mentalStrength", operation: "add", value: 2 },
      { id: "stealth", operation: "add", value: -15 }
    ],
    length: 3,
    isWithdrawal: false,
    nextEffectId: "alcohol_withdraw",
    description:
      "Vous avez bu de l'alcool, cela devient visible ! Bizarrement, vous n'avez plus très peur, et vous en avez un peu rien à foutre.",
    od: null
  },
  wasted: {
    id: "wasted",
    label: "Tout bourré",
    symptoms: [
      { id: "intelligence", operation: "add", value: -2 },
      { id: "perception", operation: "add", value: -3 },
      { id: "agility", operation: "add", value: -3 },
      { id: "charisma", operation: "add", value: -3 },
      { id: "speech", operation: "add", value: -30 },
      { id: "barter", operation: "add", value: -30 }
    ],
    length: 3,
    isWithdrawal: false,
    nextEffectId: "alcohol_withdraw",
    description: "Touuuuuuut vaaaaa bienbienbiennnn ?",
    od: null
  },
  alcohol_withdraw: {
    id: "alcohol_withdraw",
    label: "Gueule de bois",
    symptoms: [
      { id: "agility", operation: "add", value: -3 },
      { id: "charisma", operation: "add", value: -2 },
      { id: "endurance", operation: "add", value: -1 },
      { id: "mentalStrength", operation: "add", value: -3 }
    ],
    length: 10,
    isWithdrawal: true,
    description: "Le bien connu syndrome de la casquette plombée !",
    od: null,
    nextEffectId: null
  },
  lunaticPlus: {
    id: "lunaticPlus",
    label: "Super humeur!",
    symptoms: [{ id: "charisma", operation: "add", value: 3 }],
    length: 24,
    isWithdrawal: false,
    description: "Ahhh ! Quel plaisir de vous voir de cette humeur !",
    od: null,
    nextEffectId: null
  },
  lunaticMinus: {
    id: "lunaticMinus",
    label: "Gloria rabat-joie",
    symptoms: [{ id: "charisma", operation: "add", value: -3 }],
    length: 24,
    isWithdrawal: false,
    description: "Ahhh... C'est le mauvais jour... ? On se revoit demain... Faut que je file !",
    od: null,
    nextEffectId: null
  },
  cheater: {
    id: "cheater",
    label: "Sale tricheur !",
    symptoms: [{ id: "luck", operation: "add", value: -3 }],
    length: null,
    isWithdrawal: false,
    description:
      "Vous avez lâchement enfreint les règles du valeureux MJ. C'est l'équivalant de croiser un chat noir en passant sous une échelle après avoir profanné un cimetierre natif américain.",
    od: null,
    nextEffectId: null
  },
  healingPowder: {
    id: "healingPowder",
    label: "Effet sec. : Poudre de soins",
    symptoms: [{ id: "perception", operation: "add", value: -1 }],
    length: 5,
    isWithdrawal: false,
    description:
      "Cette poudre que vous avez consommé embrûme l'esprit presque autant qu'elle soigne.",
    od: null,
    nextEffectId: null
  },
  superStimpack: {
    id: "superStimpack",
    label: "Effet sec. : super stimpack",
    symptoms: [{ id: "perception", operation: "add", value: -1 }],
    length: 4,
    isWithdrawal: false,
    description: "Cela soigne le corps, mais pas l'esprit. Vous êtes dans le flou.",
    od: null,
    nextEffectId: null
  },
  ultraStimpack: {
    id: "ultraStimpack",
    label: "Effet sec. : ultra stimpack",
    symptoms: [{ id: "perception", operation: "add", value: -2 }],
    length: 4,
    isWithdrawal: false,
    description: "La puissance des agents actifs engendre un état comateux.",
    od: null,
    nextEffectId: null
  },
  traumapack: {
    id: "traumapack",
    label: "Effet sec. : traumpack",
    symptoms: [
      { id: "perception", operation: "add", value: -2 },
      { id: "strength", operation: "add", value: 2 }
    ],
    length: 5,
    isWithdrawal: false,
    description: "Votre regain en vitalité vous permet de dire bonjour aux éléphants roses.",
    od: null,
    nextEffectId: null
  }
}

export default effectsMap
