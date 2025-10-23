import { create } from "zustand"

import { DbHealth } from "./Health"
import { LimbId } from "./health.const"

export type UpdateHealthStore = {
  category: keyof DbHealth
  amount: number
  rads: number
  currHp: number
  selectedLimb: LimbId | null
  limbs: Partial<Record<LimbId, number>>
  actions: {
    selectCategory: (cat: keyof DbHealth) => void
    selectAmount: (amount: number) => void
    selectLimb: (limb: LimbId) => void
    onPressMod: (type: "plus" | "minus", init: number, maxHp: number) => void
    reset: () => void
  }
}

export const useUpdateHealthStore = create<UpdateHealthStore>()((set, _, store) => ({
  category: "currHp",
  amount: 5,
  rads: 0,
  currHp: 0,
  selectedLimb: null,
  limbs: {},
  actions: {
    selectCategory: category =>
      set(() => {
        if (category === "currHp") return { category, limbs: {} }
        if (category === "limbs") return { category, currHp: 0 }
        return { category }
      }),
    selectAmount: newAmount => set(() => ({ amount: newAmount })),
    selectLimb: limb => set(() => ({ selectedLimb: limb })),
    onPressMod: (type, init, maxHp) =>
      set(state => {
        const { category, selectedLimb } = state
        const quantity = type === "plus" ? state.amount : -state.amount

        switch (category) {
          case "rads": {
            let newMod = state.rads + quantity
            // prevent negative (rads)
            if (init + newMod < 0) newMod = -init
            return { ...state, rads: newMod }
          }
          case "currHp": {
            let newMod = state.currHp + quantity
            // prevent new HP > max HP
            if (init + newMod > maxHp) newMod = maxHp - init
            return { ...state, currHp: newMod }
          }
          default: {
            if (!selectedLimb) throw new Error("A limb must be selected first")
            let newMod = state.limbs[selectedLimb] ?? 0 + quantity
            // prevent new limb HP > max
            if (init + newMod > maxHp) newMod = maxHp - init
            // prevent new limb HP < 0
            if (init + newMod < 0) newMod = -init
            return { ...state, limbs: { ...state.limbs, [selectedLimb]: newMod } }
          }
        }
      }),
    reset: () => store.setState(store.getInitialState())
  }
}))

export const useUpdateHealthActions = () => useUpdateHealthStore(state => state.actions)
export const useUpdateHealthCategory = () => useUpdateHealthStore(state => state.category)
export const useUpdateHealthAmount = () => useUpdateHealthStore(state => state.amount)
export const useUpdateHealthSelectedLimb = () => useUpdateHealthStore(state => state.selectedLimb)
export const useUpdateHealthRads = () => useUpdateHealthStore(state => state.rads)
export const useUpdateHealthCurrHp = () => useUpdateHealthStore(state => state.currHp)
export const useUpdateHealthLimbs = () => useUpdateHealthStore(state => state.limbs)
export const useUpdateHealthLimb = (id: LimbId) =>
  useUpdateHealthStore(state => state.limbs[id] ?? 0)
