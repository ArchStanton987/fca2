import { create } from "zustand"

interface CurrCharStore {
  charId: string | null
  setCharId: (charId: string) => void
}

export const useCurrCharStore = create<CurrCharStore>(set => ({
  charId: null,
  setCharId: (charId: string) => set({ charId })
}))

export function useCurrCharId() {
  const charId = useCurrCharStore(state => state.charId)
  if (!charId) throw new Error("char id is null")
  return charId
}

export function useSetCurrCharId() {
  const res = useCurrCharStore(state => state.setCharId)
  return res
}
