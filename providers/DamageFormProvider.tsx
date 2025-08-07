import { ReactNode, createContext, useContext, useMemo, useReducer } from "react"

import { GMDamageEntry } from "lib/combat/combats.types"
import { getRealDamage } from "lib/combat/utils/combat-utils"

import { useCombat } from "./CombatProvider"

const defaultInactiveEntry = { charId: "", entryType: "inactive", duration: 1 } as const
const defaultDamageEntry = {
  charId: "",
  entryType: "hp",
  localization: "leftTorsoHp",
  damage: 1
} as const

let entryId = 0

type DamageEntriesState = Record<string, GMDamageEntry>

type DamageEntriesApiType = {
  add: () => void
  deleteEntry: (id: string) => void
  toggleEntryType: (id: string) => void
  setEntry: (id: string, payload: Partial<GMDamageEntry>) => void
  reset: () => void
}

const gmDamageContextForm = createContext<DamageEntriesState>({} as DamageEntriesState)
const gmDamageContextApi = createContext<DamageEntriesApiType>({} as DamageEntriesApiType)

export type DamageEntriesAction =
  | { type: "add"; payload: { targetId: string } }
  | { type: "delete"; payload: { id: string } }
  | { type: "toggleEntryType"; payload: { id: string } }
  | { type: "setEntry"; payload: { id: string; entry: Partial<GMDamageEntry> } }
  | { type: "reset"; payload?: undefined }

const reducer = (
  state: DamageEntriesState,
  { type, payload }: DamageEntriesAction
): DamageEntriesState => {
  switch (type) {
    case "add": {
      entryId += 1
      return { ...state, [entryId]: { ...defaultDamageEntry, charId: payload.targetId } }
    }
    case "delete": {
      const cpy = { ...state }
      delete cpy[payload.id]
      return { ...cpy }
    }
    case "toggleEntryType": {
      const { charId, entryType } = state[payload.id]
      const newEntry =
        entryType === "hp" ? { ...defaultInactiveEntry, charId } : { ...defaultDamageEntry, charId }
      return { ...state, [payload.id]: newEntry }
    }
    case "setEntry": {
      const { entry, id } = payload
      const newEntry = { ...state[id], ...entry }
      // @ts-ignore
      return { ...state, [id]: { ...state[id], ...newEntry } }
    }
    case "reset": {
      return {}
    }
    default:
      throw new Error("Unknown action")
  }
}

export function DamageFormProvider({ children }: { children: ReactNode }) {
  const { combat, players, npcs } = useCombat()
  const contenders = { ...players, ...npcs }
  const action = combat?.currAction

  let initEntry: DamageEntriesState = {}
  if (action) {
    const { rawDamage, damageLocalization, targetId, damageType, aimZone } = action
    const loc = aimZone || damageLocalization
    if (targetId && targetId in contenders && loc && rawDamage && damageType) {
      const newDmgEntry = { rawDamage, damageLocalization: loc, damageType }
      const realDamage = Math.round(getRealDamage(contenders[targetId].char, newDmgEntry))
      initEntry = {
        0: {
          charId: targetId,
          entryType: "hp",
          localization: loc,
          damage: realDamage
        }
      }
    }
  }

  const [state, dispatch] = useReducer(reducer, initEntry)

  const api = useMemo(
    () => ({
      add: () => {
        const targetId = typeof action?.targetId === "string" ? action?.targetId : ""
        dispatch({ type: "add", payload: { targetId: targetId ?? "" } })
      },
      deleteEntry: (id: string) => {
        dispatch({ type: "delete", payload: { id } })
      },
      toggleEntryType: (id: string) => {
        dispatch({ type: "toggleEntryType", payload: { id } })
      },
      setEntry: (id: string, payload: Partial<GMDamageEntry>) => {
        dispatch({ type: "setEntry", payload: { id, entry: payload } })
      },
      reset: () => {
        dispatch({ type: "reset" })
      }
    }),
    [action]
  )

  return (
    <gmDamageContextForm.Provider value={state}>
      <gmDamageContextApi.Provider value={api}>{children}</gmDamageContextApi.Provider>
    </gmDamageContextForm.Provider>
  )
}

export const useDamageForm = () => {
  const context = useContext(gmDamageContextForm)
  if (!context) {
    throw new Error("useDamgeForm must be used within its provider")
  }
  return context
}
export const useDamageFormApi = () => {
  const context = useContext(gmDamageContextApi)
  if (!context) {
    throw new Error("useDamgeFormApi must be used within its provider")
  }
  return context
}
