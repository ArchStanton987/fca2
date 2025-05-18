const actions = {
  weapon: {
    id: "weapon",
    label: "Arme",
    subtypes: {
      basic: { id: "basic", label: "Attaque simple" },
      aim: { id: "aim", label: "Attaque avec visée" },
      burst: { id: "burst", label: "Rafale" },
      reload: { id: "load", label: "Recharger" },
      unload: { id: "unload", label: "Décharger" },
      throw: { id: "throw", label: "Lancer" },
      hit: { id: "hit", label: "Frapper" }
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
      use: { id: "use", label: "Utiliser", apCost: 4 },
      equip: { id: "equip", label: "Équiper", apCost: 2 },
      unequip: { id: "unequip", label: "Désequiper", apCost: 2 },
      pickUp: { id: "pickUp", label: "Ramasser", apCost: 3 },
      drop: { id: "drop", label: "Lâcher", apCost: 2 },
      throw: { id: "throw", label: "Lancer", apCost: 4 }
    }
  },
  other: {
    id: "other",
    label: "Autre",
    subtypes: {}
  },
  wait: {
    id: "wait",
    label: "Attendre",
    subtypes: {},
    description:
      "Conservez vos points d'action et attendez le bon moment pour agir au cours du round."
  },
  prepare: {
    id: "prepare",
    label: "Préparer",
    subtypes: {
      dangerAwareness: {
        id: "dangerAwareness",
        label: "Anticipe les attaques",
        description:
          "Dépensez ce qu'il vous reste de points d'action pour mieux faire face au danger. Pour le prochain round, vous gagnez autant de classe d'armure (CA) que vous dépensez de points d'action (PA)."
      },
      visualize: {
        id: "visualize",
        label: "Visualiser prochaine action",
        description:
          "Dépensez ce qu'il vous reste de points d'action (PA) pour mieux réussir votre prochaine action. Pour chaque PA dépensé, vous gagnez un bonus de +2 au score de votre prochaine action."
      }
    }
  }
} as const

export default actions

export type ActionTypeId = keyof typeof actions
export type ActionSubtype<T extends ActionTypeId> = keyof (typeof actions)[T]["subtypes"]

export const withRollActionsTypes: ActionTypeId[] = ["movement", "item", "weapon"]
