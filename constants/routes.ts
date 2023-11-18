const routes = {
  home: "/",
  charSelection: "/(app)/squad/[squadId]",
  char: {
    main: {
      index: "/(app)/character/[charId]/main/",
      effects: "/(app)/character/[charId]/main/effects",
      special: "/(app)/character/[charId]/main/special",
      secAttr: "/(app)/character/[charId]/main/secAttr",
      skills: "/(app)/character/[charId]/main/skills",
      knowledges: "/(app)/character/[charId]/main/knowledges"
    },
    inventory: {
      weapons: "/(app)/character/[charId]/inventory/weapons",
      clothings: "/(app)/character/[charId]/inventory/clothings",
      consumables: "/(app)/character/[charId]/inventory/consumables",
      miscObj: "/(app)/character/[charId]/inventory/misc-objects",
      ammo: "/(app)/character/[charId]/inventory/ammo"
    },
    combat: "/(app)/character/[charId]/combat"
  }
}

export default routes
