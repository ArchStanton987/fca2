import { create } from "zustand"

interface CurrCharStore {
  charId: string
  actions: {
    setCharId: (charId: string) => void
  }
}

export const useCurrCharStore = create<CurrCharStore>(set => ({
  charId: "",
  actions: {
    setCharId: (charId: string) => set({ charId })
  }
}))

export function useCurrCharId() {
  const charId = useCurrCharStore(state => state.charId)
  return charId
}

export function useSetCurrCharId() {
  const actions = useCurrCharStore(state => state.actions)
  return actions.setCharId
}
