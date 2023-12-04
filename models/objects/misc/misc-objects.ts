import { MiscObject, MiscObjectId } from "./misc-object-types"

const miscObjectsMap: Record<MiscObjectId, MiscObject> = {
  brahmin: {
    id: "brahmin",
    label: "brahmine",
    description:
      "Le bétail des terres désolées. Sympa tant qu'on vient pas l'enquiquiner. Excellent animal de trait, si vous pouvez vous accomoder de son aspect.",
    value: 700,
    place: 0,
    symptoms: [],
    weight: 0
  },
  militaryBelt: {
    id: "militaryBelt",
    label: "ceinture militaire",
    description: "Une ceinture très bien conçue qui vous permet de ranger d'avantage de choses.",
    value: 120,
    place: 0,
    symptoms: [{ id: "maxPlace", operation: "add", value: 2 }],
    weight: 0.4
  },
  holster: {
    id: "holster",
    label: "holster",
    description:
      "Holster en peau de brahmine, le tout fait au crochet de 12. Un travail minutieux !",
    value: 50,
    place: 0,
    symptoms: [{ id: "maxPlace", operation: "add", value: 1 }],
    weight: 0.1
  },
  purse: {
    id: "purse",
    label: "sacoche",
    description:
      "Faite de peau de brahamine, elle est résistante et permet de stocker des affaires",
    value: 100,
    place: 0,
    symptoms: [{ id: "maxPlace", operation: "add", value: 4 }],
    weight: 0.5
  },
  backpack: {
    id: "backpack",
    label: "sac à dos",
    description:
      "Un bon sac à dos, bien conçu qui vous permet de transporter d'avantage de choses.",
    value: 70,
    place: 0,
    symptoms: [{ id: "maxPlace", operation: "add", value: 8 }],
    weight: 0.8
  },
  militaryBackpack: {
    id: "militaryBackpack",
    label: "sac à dos militaire",
    description: "Le top du sac à dos.",
    value: 140,
    place: 0,
    symptoms: [{ id: "maxPlace", operation: "add", value: 12 }],
    weight: 1
  },

  ballgag: {
    id: "ballgag",
    label: "baillon",
    description:
      "Peut s'utiliser dans plusieurs orifices, mais plus généralement dans la bouche pour faire taire un prisonnier ou un amant.",
    value: 20,
    place: 0.5,
    symptoms: [],
    weight: 0.2
  },
  condomBox: {
    id: "condomBox",
    label: "boite de préservatifs",
    description:
      "Ils sont périmés depuis plus de 160ans, mais au moins vous aurez bonne conscience.",
    value: 15,
    place: 0.1,
    symptoms: [],
    weight: 0.1
  },
  sardinesCan: {
    id: "sardinesCan",
    label: "boite de sardines",
    description:
      "Si on les ouvre, cela sent très fort. Cela sentait-il cette odeur quand elles ont été fabriquées en, 2076 ?",
    value: 5,
    place: 0.1,
    symptoms: [],
    weight: 0.2
  },
  boots: {
    id: "boots",
    label: "bottes",
    description: "Une paire de bottes de cuir, avec une semelle en caoutchouc résistante. ",
    value: 100,
    place: 4,
    symptoms: [],
    weight: 2
  },
  glassBottle: {
    id: "glassBottle",
    label: "bouteille vide",
    description:
      "Une bouteille en verre. Peut contenir du liquide ou servir à intimider des loubards après l'avoir brisée sur le comptoir. ",
    value: 2,
    place: 0.5,
    symptoms: [],
    weight: 0.2
  },
  papysBusinessCard: {
    id: "papysBusinessCard",
    label: "carte de visite de 'Papy'",
    description:
      "'Papy Chocolat' est le nom de l'artiste. Les coordonnées sont effacées. Les illustrations sur la carte laissent supposer qu'il s'agit ou qu'il s'agissait d'un sculpteur, qui reproduit l'humain dans toutes ses formes.",
    value: "?",
    place: 0,
    symptoms: [],
    weight: 0
  },
  rope: {
    id: "rope",
    label: "corde",
    description: "Une corde bien tressée et tout à fait utilisable.",
    value: 30,
    place: 5,
    symptoms: [],
    weight: 3
  },
  catsPaw: {
    id: "catsPaw",
    label: "magazine 'Cat's Paw'",
    description:
      "Un magasine érotique d'avant guerre. Un design très raffiné et des articles pas du tout vulgaires.",
    value: "?",
    place: 0.1,
    symptoms: [],
    weight: 0
  },
  handcuffs: {
    id: "handcuffs",
    label: "menottes",
    description:
      "Le velours indique non seulement que le fabriquant a le soucis du confort des utilisateurs, mais aussi qu'il doit être très facile de s'en détacher.",
    value: 20,
    place: 0.2,
    symptoms: [],
    weight: 0.1
  },
  smellyGoldenWatch: {
    id: "smellyGoldenWatch",
    label: "montre en or avec une odeur suspecte",
    description:
      "Cette montre de grande horlogerie a l'air très ancienne et chargée d'histoire. Si seulement l'on pouvait connaître l'histoire qui lui donne cette odeur plutôt désagréable et déroutante...",
    value: "?",
    place: 0.1,
    symptoms: [],
    weight: 0.1
  },
  canOpener: {
    id: "canOpener",
    label: "ouvre boite",
    description: "Ouvre les boites les plus récalcitrantes, mais attention à la blessure !",
    value: 5,
    place: 0.1,
    symptoms: [],
    weight: 0.1
  },
  pipboy: {
    id: "pipboy",
    label: "pipboy",
    description:
      "Fleuron de la technologie, résistant et robuste. On retrouve toute votre vie dessus, et pourtant vous n'avez pas déclaré accepter que l'on utilise vos données personnelles.",
    value: 2000,
    place: 0,
    symptoms: [],
    weight: 0
  },
  alarmClock: {
    id: "alarmClock",
    label: "réveil",
    description: "Le bouton d'arrêt a l'air de pouvoir résister à des lendemains difficiles.",
    value: 5,
    place: 2,
    symptoms: [],
    weight: 0.4
  },
  bottomSculpture: {
    id: "bottomSculpture",
    label: "sculpture de boule",
    description:
      "Il semble que cela soit du bronze... Mais celle-ci n'a jamais pu en 'couler'. Cela a vraiment l'air d'être artistique. Elle est en bon étant et porte une griffe 'Pappy C.' à la place du tatouage papillon / tribal en bas des reins.",
    value: "?",
    place: 2,
    symptoms: [],
    weight: 3
  },
  tape: {
    id: "tape",
    label: "scotch",
    description: "L'indispensable pour tout bricolage.",
    value: 5,
    place: 0.1,
    symptoms: [],
    weight: 0
  }
}

export default miscObjectsMap
