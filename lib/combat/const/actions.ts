const actions = {
  weapon: {
    id: "weapon",
    label: "Arme",
    subtypes: {
      basic: { id: "basic", label: "Attaque simple" },
      aim: { id: "aim", label: "Attaque avec visée" },
      burst: { id: "burst", label: "Rafale" },
      reload: { id: "reload", label: "Recharger" },
      unload: { id: "unload", label: "Décharger" }
    }
  },
  movement: {
    id: "movement",
    label: "Déplacement",
    subtypes: {
      run: { id: "run", label: "Courir", apCost: null, distance: "18m" },
      walk: { id: "walk", label: "Marcher", apCost: null, distance: "8m" },
      getUp: { id: "getUp", label: "Se relever", apCost: 4, distance: "0m" },
      sprint: { id: "sprint", label: "Sprint", apCost: null, distance: "35m" },
      crawl: { id: "crawl", label: "Ramper", apCost: 3, distance: "1m" },
      jump: { id: "jump", label: "Sauter", apCost: 4, distance: "2m" },
      climb: { id: "climb", label: "Grimper", apCost: null, distance: "1.5m" }
    }
  },
  item: {
    id: "item",
    label: "Objets / Inv.",
    subtypes: {
      drop: { id: "drop", label: "Lâcher", apCost: 2 },
      equip: { id: "equip", label: "Équiper", apCost: 2 },
      unequip: { id: "unequip", label: "Désequiper", apCost: 2 },
      use: { id: "use", label: "Utiliser", apCost: 3 },
      search: { id: "search", label: "Chercher", apCost: 4 },
      throw: { id: "throw", label: "Lancer", apCost: 3 },
      pickUp: { id: "pickUp", label: "Ramasser", apCost: 3 }
    }
  },
  other: {
    id: "other",
    label: "Autre",
    subtypes: {}
  },
  pause: {
    id: "pause",
    label: "Attendre",
    subtypes: {}
  },
  prepare: {
    id: "prepare",
    label: "Préparer",
    subtypes: {
      dangerAwareness: { id: "dangerAwareness", label: "Anticipe les attaques" },
      visualize: { id: "visualize", label: "Visualiser prochaine action" }
    }
  }
} as const

export default actions

export type ActionTypeId = keyof typeof actions
export type ActionSubtype<T extends ActionTypeId> = keyof (typeof actions)[T]["subtypes"]
