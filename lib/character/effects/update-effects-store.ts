import { create } from "zustand"

import { EffectId } from "./effects.types"

type UpdateEffectsStore = {
  selectedEffect: EffectId | null
  searchValue: string
  newEffects: EffectId[]
  actions: {
    selectEffect: (id: EffectId) => void
    setSearch: (txt: string) => void
    update: () => void
    reset: () => void
  }
}

export const useUpdateEffects = create<UpdateEffectsStore>()((set, _, store) => ({
  selectedEffect: null,
  searchValue: "",
  newEffects: [],
  actions: {
    selectEffect: id => set(() => ({ selectedEffect: id })),
    setSearch: txt => set(() => ({ searchValue: txt })),
    update: () =>
      set(state => {
        if (!state.selectedEffect) return state
        const hasEffect = state.newEffects.includes(state.selectedEffect)

        return {
          ...state,
          newEffects: hasEffect
            ? state.newEffects.filter(e => e !== state.selectedEffect)
            : [...state.newEffects, state.selectedEffect]
        }
      }),
    reset: () => store.setState(store.getInitialState())
  }
}))

export const useUpdateEffectsAction = () => useUpdateEffects(state => state.actions)
