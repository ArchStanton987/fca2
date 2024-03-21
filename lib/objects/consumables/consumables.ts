import { ConsumableData, ConsumableId } from "./consumables.types"

const consumablesMap: Record<ConsumableId, ConsumableData> = {
  ration: {
    id: "ration",
    label: "Ration",
    effectId: null,
    challengeLabel: null,
    od: false,
    addict: false,
    value: 20,
    place: 1,
    weight: 0.6,
    description: `Tout ce qu'il faut pour bien se nourrir et s'hydrater pendant une journée`,
    tags: ["heal"],
    maxUsage: 1
  },
  healingPowder: {
    id: "healingPowder",
    label: "Poudre de soins",
    effectId: "healingPowder",
    challengeLabel: "+2D6 HP",
    od: false,
    addict: "10-24",
    value: 50,
    place: 0.1,
    weight: 0,
    description: `Une poudre médicinale puissante à base d'herbes. Attention, ses pouvoirs vous embrumeront l'esprit. Il y a fort à parier que cela a été inventé par un type qui porte des pagnes, sans sous-vêtements. `,
    tags: ["heal"],
    maxUsage: 1
  },
  stimpack: {
    id: "stimpack",
    label: "Stimpack",
    effectId: null,
    challengeLabel: "+3D6 HP",
    od: false,
    addict: "10-24",
    value: 150,
    place: 0.2,
    weight: 0.1,
    description: `L'incontournable du soin, facile, efficace et sans effet secondaire. Risque d'addiction existant néanmoins. `,
    tags: ["heal"],
    maxUsage: 1
  },
  superStimpack: {
    id: "superStimpack",
    label: "Super Stimpack",
    effectId: "superStimpack",
    challengeLabel: "+5D6 HP",
    od: false,
    addict: "5-24",
    value: 300,
    place: 0.3,
    weight: 0.1,
    description: `Le grand frère du Stimpack, plus efficace. C'est fort, et cela fait planer.`,
    tags: ["heal"],
    maxUsage: 1
  },
  ultraStimpack: {
    id: "ultraStimpack",
    label: "Ultra Stimpack",
    effectId: "ultraStimpack",
    challengeLabel: "+6D6 HP",
    od: false,
    addict: "5-24",
    value: 550,
    place: 0.4,
    weight: 0.2,
    description: `Une version très évoluée du Stimpack. Conçue pour soigner rapidement des blessures sérieuses. Je vais pas mentir, cela met dans le coltard.`,
    tags: ["heal"],
    maxUsage: 1
  },
  traumapack: {
    id: "traumapack",
    label: "Traumapack",
    effectId: "traumapack",
    challengeLabel: "+8D6 HP",
    od: false,
    addict: "5-24",
    value: 900,
    place: 0.5,
    weight: 0.3,
    description: `Substance extrêmement puissante, non sans effets secondaires. Bien lire la notice et ne pas opérer de machinerie après injection.`,
    tags: ["heal"],
    maxUsage: 1
  },
  hypo: {
    id: "hypo",
    label: "Hypo",
    effectId: null,
    challengeLabel: "100% HP",
    od: false,
    addict: "5-24",
    value: 2400,
    place: 0.1,
    weight: 0.1,
    description: `L'armée a su synthétiser ce produit miracle avant la guerre. Déjà à l'époque, c'était rare et hors de prix. Alors imaginez aujourd'hui, d'autant plus qu'il semble que la recette ait été perdue.`,
    tags: ["heal"],
    maxUsage: 1
  },
  firstAidKit: {
    id: "firstAidKit",
    label: "Kit premiers soins",
    effectId: null,
    challengeLabel: "3D6 HP",
    od: false,
    addict: false,
    value: 100,
    place: 2,
    weight: 0.6,
    description: `Un petit kit contenant du matériel médical de pase : pansements, désinfectant... Requis, test de promiers soins réussi (bonus de +20%).`,
    tags: ["kit"],
    knowledges: ["kFirstAid"],
    skillId: "aid",
    maxUsage: 10
  },
  pharmaKit: {
    id: "pharmaKit",
    label: "Trousse de soins",
    effectId: null,
    challengeLabel: "4D6 HP",
    od: false,
    addict: false,
    value: 250,
    place: 2,
    weight: 0.6,
    description: `Contient une pharmacie de base. Bandages, sparadrap, désinfectant... Requis : Test de premiers soins réussi (bonus de +30%).`,
    tags: ["kit"],
    knowledges: ["kFirstAid"],
    skillId: "aid",
    maxUsage: 5
  },
  medecineKit: {
    id: "medecineKit",
    label: "Trousse de médecin",
    effectId: null,
    challengeLabel: "5D6 HP",
    od: false,
    addict: false,
    value: 700,
    place: 3,
    weight: 2,
    description: `Cette sacoche contient des instruments médicaux et des médicaments utilisés par les médecins. Mieux vaut avoir une spécialité en médecine pour utiliser ce qu'il y a dedans... (bonus de +30%).`,
    tags: ["kit"],
    knowledges: ["kMedicine"],
    skillId: "aid",
    maxUsage: 15
  },
  interventionKit: {
    id: "interventionKit",
    label: "Kit d'intervention",
    effectId: null,
    challengeLabel: "6D6 HP",
    od: false,
    addict: false,
    value: 800,
    place: 3,
    weight: 2,
    description: `Ce sac contient des instruments et des médicaments prévus pour des blessures graves et urgentes. Si vous l'utilisez, j'espère que vous savez ce que vous faites ! (bonus de +40%).`,
    tags: ["kit"],
    knowledges: ["kMedicine"],
    skillId: "aid",
    maxUsage: 10
  },
  antidote: {
    id: "antidote",
    label: "Antidote",
    effectId: null,
    challengeLabel: "Guérit poison",
    od: false,
    addict: "10-24",
    value: 300,
    place: 1,
    weight: 1,
    description: `Une seringue contenant un antidote artisanal contre le poison. Un liquide blanchâtre dans lequel flottent des morceaux de chair de radscorpion. Baaaark !`,
    tags: ["heal"],
    maxUsage: 1
  },
  radX: {
    id: "radX",
    label: "Rad-X",
    effectId: "radx",
    challengeLabel: null,
    od: false,
    addict: "5-24",
    value: 1000,
    place: 0.1,
    weight: 0,
    description: `Une gellule anti-radiation à ingérer avant exposition à des radiations. Jusqu'à 24 heures de protection. Pas d'effets secondaires connus.`,
    tags: ["heal"],
    maxUsage: 1
  },
  radAway: {
    id: "radAway",
    label: "Rad-Away",
    effectId: null,
    modifiers: [{ id: "rads", operation: "add", value: -300 }],
    challengeLabel: "-300 RADS",
    od: 6,
    addict: "5-24",
    value: 1200,
    place: 1,
    weight: 0.2,
    description: `Permet de réduire le niveau de radioactivité de votre corps et d'en soigner les effets. `,
    tags: ["heal"],
    maxUsage: 1
  },
  voodoo: {
    id: "voodoo",
    label: "Voodoo",
    effectId: "voodoo",
    challengeLabel: null,
    od: 5,
    addict: "1-6",
    value: 450,
    place: 0.2,
    weight: 0.1,
    description: `Une concoction spéciale réalisée par un chamane, grand sachem... Bref un individu qui portait probablement un pagne et un crâne de bahamine sur la tête.`,
    tags: ["drug"],
    maxUsage: 1
  },
  amphetagum: {
    id: "amphetagum",
    label: "Amphétagum",
    effectId: "amphetagum",
    challengeLabel: null,
    od: 3,
    addict: "1-12",
    value: 350,
    place: 0.1,
    weight: 0,
    description: `Stimule le système nerveux et améliore le tonus musculaire. Risque d'accoutumance.`,
    tags: ["drug"],
    maxUsage: 1
  },
  buffout: {
    id: "buffout",
    label: "Buffout",
    effectId: "buffout",
    challengeLabel: null,
    od: 5,
    addict: "1-48",
    value: 350,
    place: 0.1,
    weight: 0,
    description: `Un petit cacheton inventé avant la grande guerre... Cela permettait aux soldats de tenir le coup en mission vachement plus longtemps. Selon la légende, cette gellule était aussi utilisée par les sportifs chinois autrefois. Pas vraiment d'effets secondaires constatés, mais un risque d'acoutumance.`,
    tags: ["drug"],
    maxUsage: 1
  },
  mentats: {
    id: "mentats",
    label: "Mentats",
    effectId: "mentats",
    challengeLabel: null,
    od: 5,
    addict: "1-48",
    value: 400,
    place: 0.1,
    weight: 0,
    description: `Une superbe invention pour booster son potentiel intellectuel. Apprécié des scientifiques, des étudiants... et de pas mal de monde ! Même si l'emballage est coloré, ce ne sont pas des bonbons ! Améliore très significativement les processus cognitifs et les capacités de perception. Risque d'accoutumance. Il est généralement admis qu'à la fin des effets, il faut de trouver un endroit calme et bien se reposer.`,
    tags: ["drug"],
    maxUsage: 1
  },
  psycho: {
    id: "psycho",
    label: "Psycho",
    effectId: "psycho",
    challengeLabel: null,
    od: 2,
    addict: "1-48",
    value: 500,
    place: 0.8,
    weight: 0.2,
    description: `Encore un truc inventé par l'armée pour maximiser le potentiel de combat de la personne s'en injectant. Attention, cela rend carrément vénère ! Il parait même qu'une fois un gars qui en a trop pris s'est lui même dévoré le bras !`,
    tags: ["drug"],
    maxUsage: 1
  },
  jet: {
    id: "jet",
    label: "Jet",
    effectId: "jet",
    challengeLabel: null,
    od: 2,
    addict: "1-1",
    value: 75,
    place: 0.3,
    weight: 0.1,
    description: `Un truc assez nouveau, qui aurait été inventé du côté du New Reno. D'après la légende, cela rend très speed, et stimule fortement le tonus musculaire. Concernant les rumeurs, la descente est vraiment moche, et il parait que c'est vraiment très addictif.`,
    tags: ["drug"],
    maxUsage: 1
  },
  beer: {
    id: "beer",
    label: "Bière",
    effectId: "alcohol",
    challengeLabel: null,
    od: 20,
    addict: false,
    value: 10,
    place: 1,
    weight: 0.5,
    description: `Une canouche qui date de l'avant guerre. La pasteurisation et la teneur en alcool assurent une relative intégrité du produit. Pour le goût, on est moins sûrs...`,
    tags: ["drugs"],
    maxUsage: 1
  },
  caliWine: {
    id: "caliWine",
    label: "Vin californien",
    effectId: "alcohol",
    challengeLabel: null,
    od: 20,
    addict: false,
    value: 60,
    place: 1.5,
    weight: 1,
    description: `Une bouteille de vin ordinaire produit avant la guerre. La bonne nouvelle : vous n'aurez pas à vous soucier des tanins.`,
    tags: ["drugs"],
    maxUsage: 7
  },
  hipsterBrew: {
    id: "hipsterBrew",
    label: "Bière de hipster",
    effectId: "fancyAlcohol",
    challengeLabel: null,
    od: 20,
    addict: false,
    value: 80,
    place: 1,
    weight: 0.5,
    description: `L'étiquette est un peu effacée... On ne sait pas lire si c'est écrit "Double Funk Stout NEIPA" ou "White Cofea Pale Ale". Un brevage autrefois adoré des individus à la barbe bien taillée et à la chemise à carreaux.`,
    tags: ["drugs"],
    maxUsage: 1
  },
  banquetWine: {
    id: "banquetWine",
    label: "Vin de banquet",
    effectId: "fancyAlcohol",
    challengeLabel: null,
    od: 20,
    addict: false,
    value: 600,
    place: 1.5,
    weight: 1,
    description: `Un vin prestigieux, issu des vignes prestigieuses de la Nappa Valley. Saura ravir tout grand amateur, ou toute personne souhaitant impressionner ses invités.`,
    tags: ["drugs"],
    maxUsage: 7
  },
  schnaps: {
    id: "schnaps",
    label: "Schnaps",
    effectId: "alcohol",
    challengeLabel: null,
    od: 20,
    addict: false,
    value: 50,
    place: 0.4,
    weight: 0.3,
    description: `Une petite flasque de schnaps à la pêche "Dr Fritz!". Le visage sur la bouteille semble indiquer que sa consommation rend heureux.`,
    tags: ["drugs"],
    maxUsage: 3
  },
  whisky: {
    id: "whisky",
    label: "Whisky",
    effectId: "alcohol",
    challengeLabel: null,
    od: 20,
    addict: false,
    value: 50,
    place: 0.4,
    weight: 0.3,
    description: `Une flasque de whisky assez commune. La suggestion de le consommer en cocktail avec du Nuka Cola ne laisse pas présager qu'il s'agisse d'un produit noble.`,
    tags: ["drugs"],
    maxUsage: 3
  },
  rum: {
    id: "rum",
    label: "Rhum",
    effectId: "alcohol",
    challengeLabel: null,
    od: 20,
    addict: false,
    value: 50,
    place: 0.4,
    weight: 0.3,
    description: `Une flasque de rhum "Captain Dreadnough". Le fabricant garanti son degré d'alcool à 40°, ainsi que l'haleine de pirate.`,
    tags: ["drugs"],
    maxUsage: 3
  },
  vodka: {
    id: "vodka",
    label: "Vodka",
    effectId: "alcohol",
    challengeLabel: null,
    od: 20,
    addict: false,
    value: 50,
    place: 0.4,
    weight: 0.3,
    description: `Une flasque de vodka "L'elixir de KAMARAD YOURI". S'il y a une chose que les rouges savaient bien faire, c'était de l'alcool médiocre.`,
    tags: ["drugs"],
    maxUsage: 3
  },
  homePunch: {
    id: "homePunch",
    label: "Punch du désert",
    effectId: "booze",
    challengeLabel: null,
    od: 15,
    addict: false,
    value: 8,
    place: 0.4,
    weight: 0.3,
    description: `Un classique du nouvel Ouest Américain. Chacun a sa recette propre... A défaut d'avoir des ingrédients "propres".`,
    tags: ["drugs"],
    maxUsage: 1
  },
  twistGut: {
    id: "twistGut",
    label: "Tord-boyaux",
    effectId: "booze",
    challengeLabel: null,
    od: 15,
    addict: false,
    value: 10,
    place: 0.4,
    weight: 0.3,
    description: `Un spiritueux préparé avec... C'est pas précisé. Certains y trouvent un goût de fourmi de feu, mais pour ça il faut déjà en connaître le goût.`,
    tags: ["drugs"],
    maxUsage: 3
  }
}

export default consumablesMap
