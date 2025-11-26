import { create } from "zustand"

type TxtFields = "location" | "title" | "description"

type CreateCombatStore = {
  location: string
  title: string
  description: string
  contenders: string[]
  isStartingNow: boolean
  actions: {
    toggleIsStartingNow: () => void
    toggleChar: (charId: string) => void
    setField: (key: TxtFields, value: string) => void
    reset: () => void
  }
}

const useCreateCombatStore = create<CreateCombatStore>()((set, get, store) => ({
  location: "",
  title: "",
  description: "",
  contenders: [],
  isStartingNow: true,
  actions: {
    toggleIsStartingNow: () => set(state => ({ isStartingNow: !state.isStartingNow })),
    toggleChar: charId =>
      set(state => {
        const isSelected = state.contenders.includes(charId)
        if (isSelected) return { contenders: state.contenders.filter(c => c !== charId) }
        return { contenders: [...state.contenders, charId] }
      }),
    setField: (key, value) => set(() => ({ [key]: value })),
    reset: () => set(() => store.getInitialState())
  }
}))

export const useCreateCombatActions = () => useCreateCombatStore(state => state.actions)

export const useCreateCombatLocation = () => useCreateCombatStore(state => state.location)
export const useCreateCombatTitle = () => useCreateCombatStore(state => state.title)
export const useCreateCombatDescription = () => useCreateCombatStore(state => state.description)
export const useCreateCombatContenders = () => useCreateCombatStore(state => state.contenders)
export const useCreateCombatIsStartingNow = () => useCreateCombatStore(state => state.isStartingNow)
