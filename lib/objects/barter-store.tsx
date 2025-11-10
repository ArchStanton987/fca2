import { Item } from "lib/inventory/item.mappers"
import { useAmmo, useCaps, useItemCount } from "lib/inventory/use-sub-inv-cat"
import ammoMap from "lib/objects/data/ammo/ammo"
import { AmmoType } from "lib/objects/data/ammo/ammo.types"
import { create } from "zustand"

import { AdditionalElContextType } from "providers/AdditionalElementsProvider"
import { isKeyOf } from "utils/ts-utils"

export type InventoryCategory =
  | "weapons"
  | "clothings"
  | "consumables"
  | "miscObjects"
  | "ammo"
  | "caps"
type RecordCat = {
  weapons: Record<string, number>
  clothings: Record<string, number>
  consumables: Record<string, number>
  miscObjects: Record<string, number>
  ammo: Record<string, number>
  caps: number
}

type Category = {
  id: InventoryCategory
  label: string
  selectors: number[]
  hasSearch: boolean
  data: Record<string, { id: string; label: string }>
}

export const getCategoriesMap = (
  allItems: AdditionalElContextType
): Record<InventoryCategory, Category> => ({
  weapons: {
    id: "weapons",
    label: "Armes",
    selectors: [1, 5],
    hasSearch: true,
    data: allItems.weapons
  },
  clothings: {
    id: "clothings",
    label: "Armures",
    selectors: [1, 5],
    hasSearch: false,
    data: allItems.clothings
  },
  consumables: {
    id: "consumables",
    label: "Consommables",
    selectors: [1, 5, 20],
    hasSearch: false,
    data: allItems.consumables
  },
  miscObjects: {
    id: "miscObjects",
    label: "Objets",
    selectors: [1, 5, 20, 100],
    hasSearch: true,
    data: allItems.miscObjects
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
})

type BarterStore = {
  category: InventoryCategory
  amount: number
  selectedItem: string | null
  searchInput: string
  barter: RecordCat
  actions: {
    selectCategory: (cat: InventoryCategory) => void
    selectAmount: (amount: number) => void
    selectItem: (id: string) => void
    onPressMod: (type: "plus" | "minus", inInv: number) => void
    setInput: (value: string) => void
    reset: () => void
  }
}

const useBarterStore = create<BarterStore>()((set, get, store) => ({
  category: "weapons",
  amount: 5,
  selectedItem: null,
  searchInput: "",
  barter: {
    weapons: {},
    clothings: {},
    consumables: {},
    miscObjects: {},
    ammo: {},
    caps: 0
  },
  actions: {
    selectCategory: cat =>
      set(() => {
        if (cat === "caps") {
          get().actions.selectItem("caps")
        }
        return { category: cat }
      }),
    selectAmount: amount => set(() => ({ amount })),
    selectItem: id => set(() => ({ selectedItem: id })),
    setInput: value => set(() => ({ searchInput: value })),
    onPressMod: (type, inInv) => {
      const itemId = get().selectedItem
      if (!itemId) return
      const cat = get().category
      const isCaps = cat === "caps"
      const amount = type === "minus" ? -get().amount : get().amount
      const currValue = isCaps ? get().barter.caps ?? 0 : get().barter[cat][itemId] ?? 0
      let newValue = currValue + amount
      if (newValue + inInv < 0) newValue = -inInv
      set(state => {
        if (isCaps) {
          return { ...state, barter: { ...state.barter, caps: newValue } }
        }
        return {
          ...state,
          barter: { ...state.barter, [cat]: { ...state.barter[cat], [itemId]: newValue } }
        }
      })
    },
    reset: () => store.setState(store.getInitialState())
  }
}))

export const useBarterActions = () => useBarterStore(state => state.actions)

export const useBarterCategory = () => useBarterStore(state => state.category)
export const useBarterAmount = () => useBarterStore(state => state.amount)
export const useBarterSelectedItem = () => useBarterStore(state => state.selectedItem)
export const useBarterInput = () => useBarterStore(state => state.searchInput)
export const useBarterItemCount = (id: string) =>
  useBarterStore(state => {
    const cat = state.category
    if (cat === "caps") {
      return state.barter.caps ?? 0
    }
    return state.barter[cat][id] ?? 0
  })

export const useBarterWeapons = () => useBarterStore(state => state.barter.weapons)
export const useBarterWeapon = (id: string) => useBarterStore(state => state.barter.weapons[id])
export const useBarterClothings = () => useBarterStore(state => state.barter.clothings)
export const useBarterClothing = (id: string) => useBarterStore(state => state.barter.clothings[id])
export const useBarterConsumables = () => useBarterStore(state => state.barter.consumables)
export const useBarterConsumable = (id: string) =>
  useBarterStore(state => state.barter.consumables[id])
export const useBarterMiscObjects = () => useBarterStore(state => state.barter.miscObjects)
export const useBarterMiscObject = (id: string) =>
  useBarterStore(state => state.barter.miscObjects[id])
export const useBarterAmmos = () => useBarterStore(state => state.barter.ammo)
export const useBarterAmmo = (id: string) => useBarterStore(state => state.barter.ammo[id])
export const useBarterCaps = () => useBarterStore(state => state.barter.caps)

export const useInInvCount = (charId: string, id: "caps" | AmmoType | Item["id"]) => {
  const caps = useCaps(charId)
  const ammo = useAmmo(charId)
  const itemCount = useItemCount(charId, id)

  let inInv = 0
  if (id === "caps") {
    inInv = caps.data
  } else if (isKeyOf(id, ammoMap)) {
    inInv = ammo.data[id]
  } else {
    inInv = itemCount.data
  }
  return inInv
}
