/* eslint-disable import/prefer-default-export */
import { createStore } from "zustand"

import { DamageEntry } from "./combats.types"

export type DamageFormPannel = "chars" | "bodyParts" | "effects"

export type GMDamageFormState = {
  pannel: DamageFormPannel
  selectedEntry: number | null
  newEntryId: number
  entries: Record<number, DamageEntry>
  actions: {
    setPannel: (pannel: DamageFormPannel) => void
    addEntry: () => void
    selectEntry: (e: number) => void
    deleteEntry: (e: number) => void
    toggleEntryType: () => void
    setEntry: <T extends keyof DamageEntry>(key: keyof DamageEntry, value: DamageEntry[T]) => void
    clear: () => void
  }
}
const entryTypes = ["hp", "rads", "effect", "inactive"] as const
const initState = {
  pannel: "chars" as const,
  selectedEntry: null,
  entries: {},
  newEntryId: 1
}
const defaultEntries = {
  hp: {
    charId: "",
    entryType: "hp" as const,
    localization: "rightTorsoHp" as const,
    damage: 1
  },
  rads: { charId: "", entryType: "rads" as const, amount: 10 },
  inactive: { charId: "", entryType: "effect" as const, effectId: "" as const },
  effect: { charId: "", entryType: "effect" as const, effectId: "" as const }
}

export const createDmgStore = (initEntries: Record<number, DamageEntry>) =>
  createStore<GMDamageFormState>(set => ({
    ...initState,
    entries: initEntries ?? { ...initState.entries },
    actions: {
      setPannel: (pannel: DamageFormPannel) => set({ pannel }),
      addEntry: () =>
        set(state => {
          const id = state.newEntryId + 1
          return { entries: { ...state.entries, [id]: defaultEntries.hp }, newEntryId: id }
        }),
      selectEntry: (e: number) => set({ selectedEntry: e }),
      deleteEntry: (id: number) =>
        set(state => {
          const newEntries = { ...state.entries }
          delete newEntries[id]
          return { entries: newEntries }
        }),
      toggleEntryType: () =>
        set(state => {
          const { selectedEntry, entries } = state
          if (!selectedEntry) return { ...state }
          const currEntryType = entries[selectedEntry].entryType
          const currIndex = entryTypes.indexOf(currEntryType)
          const newIndex = currIndex === entryTypes.length - 1 ? 0 : currIndex + 1
          const newType = entryTypes[newIndex]
          const newEntry = defaultEntries[newType]
          return { entries: { ...entries, [selectedEntry]: newEntry } }
        }),
      setEntry: <T extends keyof DamageEntry>(key: keyof DamageEntry, value: DamageEntry[T]) =>
        set(state => {
          const { selectedEntry, entries } = state
          if (!selectedEntry) return { ...state }
          const updatedEntry = { ...state.entries[selectedEntry], [key]: value }
          return { entries: { ...entries, [selectedEntry]: updatedEntry } }
        }),
      clear: () => set({ ...initState })
    }
  }))
