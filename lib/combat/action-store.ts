import { LimbsHp } from "lib/character/health/health-types"
import Action from "lib/combat/Action"
import { ActionTypeId } from "lib/combat/const/actions"
import { DamageTypeId } from "lib/objects/data/weapons/weapons.types"
import { Form } from "lib/shared/types/utils-types"
import { createStore } from "zustand"

import { getNewNumpadValue } from "components/NumPad/useNumPad"

// Define the type for the form
export type ActionFormType = Form<{
  actorId: string
  actionType: ActionTypeId
  actionSubtype: string
  isCombinedAction: boolean
  apCost: number
  actorDiceScore?: string
  targetId?: string
  aimZone?: keyof LimbsHp
  damageLocalization?: keyof LimbsHp
  rawDamage?: string
  damageType?: DamageTypeId
  itemDbKey?: string
}>

// Default state
export const defaultActionForm = {
  actorId: "",
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

// Function to convert Action instance to ActionFormType
function convertActionToForm(action: Action): ActionFormType {
  return {
    actorId: action.actorId, // Actor ID stays the same
    actionType: action.actionType ?? "", // If actionType is undefined, default to ""
    actionSubtype: action.actionSubtype ?? "", // If actionSubtype is undefined, default to ""
    isCombinedAction: action.isCombinedAction ?? false, // Default to false if undefined
    apCost: action.apCost ?? 0, // Default to 0 if undefined
    actorDiceScore: action.isDone ? String(action.apCost) : "", // Example logic for actorDiceScore
    targetId: typeof action.targetId === "string" ? action.targetId : undefined, // Default to empty string if undefined
    aimZone: typeof action.aimZone === "string" ? action.aimZone : undefined, // Default to empty string if undefined
    damageLocalization:
      typeof action.damageLocalization === "string" ? action.damageLocalization : undefined, // Default to empty string if undefined
    rawDamage: action.rawDamage ? String(action.rawDamage) : "", // Convert rawDamage to string if exists
    damageType: typeof action.damageType === "string" ? action.damageType : undefined, // Default to empty string if undefined
    itemDbKey: typeof action.itemDbKey === "string" ? action.itemDbKey : undefined // Default to empty string if undefined
  }
}

// Define the Zustand store
export type ActionStore = ActionFormType & {
  actions: {
    setActionType: (
      payload: { actionType: ActionTypeId } | { actionType: "weapon"; itemDbKey: string }
    ) => void
    setActionSubtype: (actionSubtype: string, apCost: number) => void
    setActorId: (id: string) => void
    setForm: (payload: Partial<ActionFormType>) => void
    setRoll: (value: string, type: "action" | "damage") => void
    reset: () => void
  }
}

// Create the store
export const createActionStore = (initAction: Action) =>
  createStore<ActionStore>(set => ({
    ...convertActionToForm(initAction),
    actions: {
      setActionType: payload => {
        set(state => {
          const { isCombinedAction, actorId } = state
          const { actionType } = payload
          const newState = { ...defaultActionForm, actorId, isCombinedAction, actionType }
          if ("itemDbKey" in payload) return { ...newState, itemDbKey: payload.itemDbKey }
          if (actionType === "prepare" || actionType === "wait")
            return { ...newState, isCombinedAction: false }
          return newState
        })
      },

      setActionSubtype: (actionSubtype, apCost) => {
        set(state => {
          const { actionType, itemDbKey, isCombinedAction, actorId } = state
          const newState = {
            ...defaultActionForm,
            actorId,
            isCombinedAction,
            actionType,
            actionSubtype,
            apCost
          }
          if (actionType === "weapon") return { ...newState, itemDbKey }
          return newState
        })
      },

      setActorId: id => {
        set({ ...defaultActionForm, actorId: id })
      },

      setForm: payload => {
        set(state => ({ ...state, ...payload }))
      },

      setRoll: (value, type) => {
        set(state => {
          const key = type === "action" ? "actorDiceScore" : "rawDamage"
          const initRollValue = state[key] ?? ""
          const newValue = getNewNumpadValue(initRollValue, value)
          return { ...state, [key]: newValue }
        })
      },

      reset: () => {
        set(defaultActionForm)
      }
    }
  }))
