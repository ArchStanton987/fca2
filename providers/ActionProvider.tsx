import { createContext, useContext, useMemo, useReducer } from "react"

import { LimbsHp } from "lib/character/health/health-types"
import { ActionTypeId } from "lib/combat/const/actions"
import { DamageTypeId } from "lib/objects/data/weapons/weapons.types"
import { Form } from "lib/shared/types/utils-types"

import { getNewNumpadValue } from "components/NumPad/useNumPad"

export type ActionStateContext = Form<{
  actionType: ActionTypeId
  actionSubtype: string
  isCombinedAction: boolean
  apCost: number
  actorDiceScore?: string
  targetId?: string
  aimZone?: keyof LimbsHp
  damageLocalization?: keyof LimbsHp
  rawDamage?: number
  damageType?: DamageTypeId
  itemDbKey?: string
}>

type ActionApiContext = {
  setActionType: (
    payload:
      | { actionType: ActionTypeId }
      | { actionType: "weapon"; itemId: string; itemDbKey: string }
  ) => void
  setActionSubtype: (actionSubtype: string, apCost?: number) => void
  setForm: (payload: Partial<ActionStateContext>) => void
  setRoll: (e: string) => void
  reset: () => void
}

export const defaultActionForm = {
  actionType: "",
  actionSubtype: "",
  isCombinedAction: false,
  apCost: 0,
  actorDiceScore: undefined,
  targetId: undefined,
  aimZone: undefined,
  damageLocalization: undefined,
  rawDamage: undefined,
  damageType: undefined,
  itemDbKey: undefined
} as const

const actionContextForm = createContext<ActionStateContext>({} as ActionStateContext)
const actionContextApi = createContext<ActionApiContext>({} as ActionApiContext)

type Action =
  | {
      type: "SET_ACTION_TYPE"
      payload: { actionType: ActionTypeId } | { actionType: "weapon"; itemDbKey: string }
    }
  | { type: "SET_ACTION_SUBTYPE"; payload: { actionSubtype: string; apCost?: number } }
  | { type: "SET_FORM"; payload: Partial<ActionStateContext> }
  | { type: "SET_ROLL"; payload: string }
  | { type: "RESET"; payload: undefined }

const reducer = (state: ActionStateContext, { type, payload }: Action): ActionStateContext => {
  switch (type) {
    case "SET_ACTION_TYPE": {
      const { isCombinedAction } = state
      const { actionType } = payload
      const newState = { ...defaultActionForm, isCombinedAction, actionType }
      if ("itemDbKey" in payload) return { ...newState, itemDbKey: payload.itemDbKey }
      if (actionType === "prepare" || actionType === "wait")
        return { ...newState, isCombinedAction: false }
      return newState
    }

    case "SET_ACTION_SUBTYPE": {
      const { actionType, itemDbKey, isCombinedAction } = state
      const { actionSubtype, apCost = defaultActionForm.apCost } = payload
      const newState = {
        ...defaultActionForm,
        isCombinedAction,
        actionType,
        actionSubtype,
        apCost
      }
      if (actionType === "weapon") return { ...newState, itemDbKey }
      return newState
    }

    case "SET_FORM":
      return { ...state, ...payload }

    case "SET_ROLL": {
      const initRollValue = state?.actorDiceScore ?? ""
      const actorDiceScore = getNewNumpadValue(initRollValue, payload)
      return { ...state, actorDiceScore }
    }

    case "RESET":
      return defaultActionForm

    default: {
      throw Error(`Unknown action : ${type}`)
    }
  }
}

export function ActionProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, defaultActionForm)

  const api = useMemo(
    () => ({
      setActionType: (
        payload:
          | { actionType: ActionTypeId }
          | { actionType: "weapon"; itemId: string; itemDbKey: string }
      ) => {
        dispatch({ type: "SET_ACTION_TYPE", payload })
      },

      setActionSubtype: (actionSubtype: string, apCost?: number) => {
        dispatch({ type: "SET_ACTION_SUBTYPE", payload: { actionSubtype, apCost } })
      },

      setForm: (payload: Partial<ActionStateContext>) => {
        dispatch({ type: "SET_FORM", payload })
      },

      setRoll: (payload: string) => {
        dispatch({ type: "SET_ROLL", payload })
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
