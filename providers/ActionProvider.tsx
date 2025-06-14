import { createContext, useContext, useMemo, useReducer } from "react"

import { LimbsHp } from "lib/character/health/health-types"
import { DamageEntries, Roll } from "lib/combat/combats.types"
import { ActionTypeId } from "lib/combat/const/actions"
import { DamageTypeId } from "lib/objects/data/weapons/weapons.types"
import { Form } from "lib/shared/types/utils-types"

import { useCharacter } from "contexts/CharacterContext"

export type ActionStateContext = Form<{
  actionType: ActionTypeId
  actionSubtype: string
  actorId: string
  isCombinedAction: boolean
  apCost: number
  roll?: Roll
  healthChangeEntries?: DamageEntries
  targetId?: string
  attackType?: string
  aimZone?: keyof LimbsHp
  damageLocalization?: keyof LimbsHp
  rawDamage?: number
  damageType?: DamageTypeId
  itemId?: string
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
  reset: () => void
}

export const defaultActionForm = {
  actionType: "",
  actionSubtype: "",
  actorId: "",
  isCombinedAction: false,
  apCost: 0,
  roll: undefined,
  healthChangeEntries: undefined,
  targetId: undefined,
  attackType: undefined,
  aimZone: undefined,
  damageLocalization: undefined,
  rawDamage: undefined,
  damageType: undefined,
  itemId: undefined,
  itemDbKey: undefined
} as const

const actionContextForm = createContext<ActionStateContext>({} as ActionStateContext)
const actionContextApi = createContext<ActionApiContext>({} as ActionApiContext)

type Action =
  | {
      type: "SET_ACTION_TYPE"
      payload:
        | { actionType: ActionTypeId }
        | { actionType: "weapon"; itemId: string; itemDbKey: string }
    }
  | { type: "SET_ACTION_SUBTYPE"; payload: { actionSubtype: string; apCost?: number } }
  | { type: "SET_FORM"; payload: Partial<ActionStateContext> }
  | { type: "RESET"; payload: { actorId: string } }

const reducer = (state: ActionStateContext, { type, payload }: Action): ActionStateContext => {
  switch (type) {
    case "SET_ACTION_TYPE": {
      const { isCombinedAction, actorId } = state
      const { actionType } = payload
      const newState = { ...defaultActionForm, isCombinedAction, actorId, actionType }
      if ("itemId" in payload)
        return { ...newState, itemId: payload.itemId, itemDbKey: payload.itemDbKey }
      if (actionType === "prepare" || actionType === "wait")
        return { ...newState, isCombinedAction: false }
      return newState
    }

    case "SET_ACTION_SUBTYPE": {
      const { actionType, actorId, itemId, itemDbKey, isCombinedAction } = state
      const { actionSubtype, apCost = defaultActionForm.apCost } = payload
      const newState = {
        ...defaultActionForm,
        isCombinedAction,
        actionType,
        actorId,
        actionSubtype,
        apCost
      }
      if (actionType === "weapon") return { ...newState, itemId, itemDbKey }
      return newState
    }

    case "SET_FORM":
      return { ...state, ...payload }

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
