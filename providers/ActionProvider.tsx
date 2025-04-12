import { createContext, useContext, useMemo, useReducer } from "react"

import { HealthChangeEntries, HealthChangeEntry, SimpleRoll } from "lib/combat/combats.types"
import { ActionTypeId } from "lib/combat/const/actions"
import { Form } from "lib/shared/types/utils-types"

import { useCharacter } from "contexts/CharacterContext"

export type ActionStateContext = Form<{
  actionType: ActionTypeId
  actionSubtype: string
  actorId: string
  nextActorId: string
  apCost: number
  roll?: SimpleRoll
  healthChangeEntries: HealthChangeEntries
  targetName?: string
  attackType?: string
  aimZone?: string
  itemId?: string
}>

type ActionApiContext = {
  setActionType: (
    payload: { actionId: ActionTypeId } | { actionId: "weapon"; itemId: string }
  ) => void
  setActionSubtype: (actionSubtype: string) => void
  setForm: (payload: Partial<ActionStateContext>) => void
  addHealthEntry: (charId: string, entry: HealthChangeEntry) => void
  removeHealthEntry: (charId: string) => void
  reset: () => void
}

export const defaultActionForm = {
  actionType: "",
  actionSubtype: "",
  actorId: "",
  nextActorId: "",
  apCost: 0,
  roll: undefined,
  healthChangeEntries: {},
  targetName: "",
  attackType: undefined,
  aimZone: undefined,
  itemId: undefined
} as const

const actionContextForm = createContext<ActionStateContext>({} as ActionStateContext)
const actionContextApi = createContext<ActionApiContext>({} as ActionApiContext)

type Action =
  | {
      type: "SET_ACTION_TYPE"
      payload: { actionId: ActionTypeId } | { actionId: "weapon"; itemId: string }
    }
  | { type: "SET_ACTION_SUBTYPE"; payload: string }
  | { type: "SET_FORM"; payload: Partial<ActionStateContext> }
  | { type: "ADD_HEALTH_ENTRY"; payload: { charId: string; entry: HealthChangeEntry } }
  | { type: "REMOVE_HEALTH_ENTRY"; payload: { charId: string } }
  | { type: "RESET"; payload: { actorId: string } }

const reducer = (state: ActionStateContext, { type, payload }: Action): ActionStateContext => {
  switch (type) {
    case "SET_ACTION_TYPE": {
      const { actionId } = payload
      const newState = { ...defaultActionForm, actorId: state.actorId, actionType: actionId }
      if ("itemId" in payload) {
        return { ...newState, itemId: payload.itemId }
      }
      return newState
    }

    case "SET_ACTION_SUBTYPE": {
      const { actionType, actorId, itemId } = state
      const newState = { ...defaultActionForm, actionType, actorId, actionSubtype: payload }
      if (actionType === "weapon") return { ...newState, itemId }
      return newState
    }

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

    case "RESET":
      return { ...defaultActionForm, actorId: payload.actorId }

    default: {
      throw Error(`Unknown action : ${type}`)
    }
  }
}

export function ActionProvider({ children }: { children: React.ReactNode }) {
  const character = useCharacter()
  const actorId = character.charId
  const [state, dispatch] = useReducer(reducer, { ...defaultActionForm, actorId })

  const api = useMemo(
    () => ({
      setActionType: (
        payload: { actionId: ActionTypeId } | { actionId: "weapon"; itemId: string }
      ) => {
        dispatch({ type: "SET_ACTION_TYPE", payload })
      },

      setActionSubtype: (actionSubtype: string) => {
        dispatch({ type: "SET_ACTION_SUBTYPE", payload: actionSubtype })
      },

      setForm: (payload: Partial<ActionStateContext>) => {
        dispatch({ type: "SET_FORM", payload })
      },

      addHealthEntry: (charId: string, entry: HealthChangeEntry) => {
        dispatch({ type: "ADD_HEALTH_ENTRY", payload: { charId, entry } })
      },

      removeHealthEntry: (charId: string) => {
        dispatch({ type: "REMOVE_HEALTH_ENTRY", payload: { charId } })
      },

      reset: () => {
        dispatch({ type: "RESET", payload: { actorId } })
      }
    }),
    [actorId]
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
