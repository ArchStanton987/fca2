import { create, createStore } from "zustand"

import Health, { DbHealth } from "./Health"

type Field = Exclude<keyof DbHealth, "limbs"> | keyof DbHealth["limbs"]

type Entries = Partial<Record<Field, number>>

type HealthStore = {
  field: Field
  amount: number
  entries: Entries
  actions: {
    selectField: (field: Field) => void
    selectAmount: (amount: number) => void
    onPressMod: (type: "plus" | "minus", init: number, maxHp: number) => void
    reset: () => void
  }
}

export const useHealthStore = (health: Health) =>
  createStore<HealthStore>()((set, get, store) => ({
    field: "currHp" as const,
    amount: 5,
    entries: {},
    actions: {
      selectField: newField => set(() => ({ field: newField })),
      selectAmount: newAmount => set(() => ({ amount: newAmount })),
      onPressMod: (type, init, maxHp) =>
        set(state => {
          const { field, amount, entries } = state
          const prevMod = entries[field] ?? 0

          let newMod = type === "plus" ? prevMod + amount : prevMod - amount

          switch (field) {
            case "rads": {
              // prevent negative (rads)
              if (init + newMod < 0) newMod = -init
              return { ...state, entries: { ...state.entries, rads: newMod } }
            }
            case "currHp": {
              // prev new HP > max HP
              if (init + newMod > maxHp) newMod = maxHp - init

              // if mod is > 0

              // if mod is < 0

              return { ...state, entries: { ...state.entries, currHp: newMod } }
            }
            default: {
              //
            }
          }

          return { ...state, entries: { ...state.entries, [field]: newCount } }
        }),
      reset: () => store.setState(store.getInitialState())
    }
  }))

export const useHealthUpdateField = () => useHealthStore(state => state.field)
