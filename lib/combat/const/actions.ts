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
      drop: { id: "drop", label: "Lâcher" },
      equip: { id: "equip", label: "Équiper" },
      unequip: { id: "unequip", label: "Désequiper" },
      use: { id: "use", label: "Utiliser" },
      search: { id: "search", label: "Chercher" }
    }
  },
  pause: {
    id: "pause",
    label: "Pause",
    subtypes: {}
  },
  other: {
    id: "other",
    label: "Autre",
    subtypes: {}
  }
} as const

export default actions

export type ActionTypeId = keyof typeof actions
export type ActionSubtype<T extends ActionTypeId> = keyof (typeof actions)[T]["subtypes"]
