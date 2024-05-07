/* eslint-disable import/prefer-default-export */
import ammoMap from "lib/objects/data/ammo/ammo"
import clothingsMap from "lib/objects/data/clothings/clothings"
import consumablesMap from "lib/objects/data/consumables/consumables"
import miscObjectsMap from "lib/objects/data/misc-objects/misc-objects"
import { DbInventory } from "lib/objects/data/objects.types"
import weaponsMap from "lib/objects/data/weapons/weapons"

type Category = {
  id: string
  label: string
  selectors: number[]
  hasSearch: boolean
  data: Record<string, { id: string; label: string }>
}

export const categoriesMap: Record<keyof DbInventory, Category> = {
  weapons: {
    id: "weapons",
    label: "Armes",
    selectors: [1, 5],
    hasSearch: true,
    data: weaponsMap
  },
  clothings: {
    id: "clothings",
    label: "Armures",
    selectors: [1, 5],
    hasSearch: false,
    data: clothingsMap
  },
  consumables: {
    id: "consumables",
    label: "Consommables",
    selectors: [1, 5, 20],
    hasSearch: false,
    data: consumablesMap
  },
  miscObjects: {
    id: "miscObjects",
    label: "Objets",
    selectors: [1, 5, 20, 100],
    hasSearch: true,
    data: miscObjectsMap
  },
  ammo: {
    id: "ammo",
    label: "Munitions",
    selectors: [1, 5, 20, 100],
    hasSearch: false,
    data: ammoMap
  },
  caps: {
    id: "caps",
    label: "Caps",
    selectors: [1, 5, 20, 100, 500],
    hasSearch: false,
    data: { caps: { id: "caps", label: "Capsule(s)" } }
  }
}
