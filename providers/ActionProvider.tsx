import { createContext, useContext, useMemo, useReducer } from "react"

import { LimbsHp } from "lib/character/health/health-types"
import { HealthChangeEntries, SimpleRoll } from "lib/combat/combats.types"
import actions from "lib/combat/const/actions"
import { WeaponId } from "lib/objects/data/weapons/weapons.types"
import { Form } from "lib/shared/types/utils-types"

type ActionStateContext = Form<{
  actionType: keyof typeof actions
  actionSubtype: string
  actor: string
  apCost: number
  roll?: SimpleRoll
  healthChangeEntries: HealthChangeEntries
  weapon?: { id: WeaponId; dbKey: string }
  target?: Record<string, string>
  attackType?: string
  aimZone?: string
  itemId?: string | string[]
}>

type ActionApiContext = {
  setForm: (payload: Partial<ActionStateContext>) => void
  addHealthEntry: (charId: string, entry: Partial<LimbsHp>) => void
  removeHealthEntry: (charId: string) => void
  addTarget: (charId: string) => void
  removeTarget: (charId: string) => void
  reset: () => void
}

export const defaultActionForm = {
  actionType: "",
  actionSubtype: "",
  actor: "",
  apCost: 0,
  roll: undefined,
  healthChangeEntries: {},
  weaponId: undefined,
  target: {},
  attackType: undefined,
  aimZone: undefined,
  itemId: undefined
} as const

const actionContextForm = createContext<ActionStateContext>({} as ActionStateContext)
const actionContextApi = createContext<ActionApiContext>({} as ActionApiContext)

type Action =
  | { type: "SET_FORM"; payload: Partial<ActionStateContext> }
  | { type: "ADD_HEALTH_ENTRY"; payload: { charId: string; entry: Partial<LimbsHp> } }
  | { type: "REMOVE_HEALTH_ENTRY"; payload: { charId: string } }
  | { type: "ADD_TARGET"; payload: { charId: string } }
  | { type: "REMOVE_TARGET"; payload: { charId: string } }
  | { type: "RESET"; payload: undefined }

const reducer = (state: ActionStateContext, { type, payload }: Action): ActionStateContext => {
  switch (type) {
    case "SET_FORM":
      return { ...state, ...payload }

    case "ADD_HEALTH_ENTRY": {
      const { charId, entry } = payload
      return { ...state, healthChangeEntries: { ...state.healthChangeEntries, [charId]: entry } }
    }

    case "REMOVE_HEALTH_ENTRY": {
      const { charId } = payload
      const newHealthEntries = { ...state.healthChangeEntries }
      delete newHealthEntries[charId]
      return { ...state, healthChangeEntries: newHealthEntries }
    }

    case "ADD_TARGET": {
      const { charId } = payload
      return { ...state, target: { ...state.target, [charId]: charId } }
    }

    case "REMOVE_TARGET": {
      const { charId } = payload
      const newTarget = { ...state.target }
      delete newTarget[charId]
      return { ...state, target: newTarget }
    }
    case "RESET": {
      return defaultActionForm
    }
    default: {
      throw Error(`Unknown action : ${type}`)
    }
  }
}

export function ActionProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, defaultActionForm)

  const api = useMemo(
    () => ({
      setForm: (payload: Partial<ActionStateContext>) => {
        dispatch({ type: "SET_FORM", payload })
      },

      addHealthEntry: (charId: string, entry: Partial<LimbsHp>) => {
        dispatch({ type: "ADD_HEALTH_ENTRY", payload: { charId, entry } })
      },

      removeHealthEntry: (charId: string) => {
        dispatch({ type: "REMOVE_HEALTH_ENTRY", payload: { charId } })
      },

      addTarget: (charId: string) => {
        dispatch({ type: "ADD_TARGET", payload: { charId } })
      },

      removeTarget: (charId: string) => {
        dispatch({ type: "REMOVE_TARGET", payload: { charId } })
      },

      reset: () => {
        dispatch({ type: "RESET", payload: undefined })
      }
    }),
    []
  )

  return (
    <actionContextForm.Provider value={state}>
      <actionContextApi.Provider value={api}>{children}</actionContextApi.Provider>
    </actionContextForm.Provider>
  )
}
export const useActionForm = () => {
  const context = useContext(actionContextForm)
  if (!context) {
    throw new Error("useActionState must be used within an ActionProvider")
  }
  return context
}
export const useActionApi = () => {
  const context = useContext(actionContextApi)
  if (!context) {
    throw new Error("useActionApi must be used within an ActionProvider")
  }
  return context
}
