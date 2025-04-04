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
      run: { id: "run", label: "Courir" },
      walk: { id: "walk", label: "Marcher" },
      getUp: { id: "getUp", label: "Se relever" },
      sprint: { id: "sprint", label: "Sprint" },
      crawl: { id: "crawl", label: "Ramper" },
      jump: { id: "jump", label: "Sauter" },
      climb: { id: "climb", label: "Grimper" }
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
