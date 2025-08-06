import React, { createContext, useContext, useMemo, useReducer } from "react"

import { getNewNumpadValue } from "components/NumPad/useNumPad"

export type ReactionStateContext = {
  // charId: string
  reaction: "none" | "parry" | "dodge"
  diceRoll: string
  // skillScore: number
  // skillId?: SkillId
  // apCost: number
  // armorClass: number
}

type ReactionApiContext = {
  setReactionForm: (e: Partial<ReactionStateContext>) => void
  setReactionRoll: (e: string) => void
  reset: () => void
}

export const defaultReactionForm = {
  // charId: "",
  reaction: "none",
  diceRoll: ""
  // skillScore: 0,
  // apCost: 0,
  // armorClass: 0
} as const

const ReactionContextForm = createContext<ReactionStateContext>({} as ReactionStateContext)
const ReactionContextApi = createContext<ReactionApiContext>({} as ReactionApiContext)

type Action =
  | { type: "SET_FORM"; payload: Partial<ReactionStateContext> }
  | { type: "SET_ROLL"; payload: string }
  | { type: "RESET"; payload: undefined }

const reducer = (state: ReactionStateContext, { type, payload }: Action): ReactionStateContext => {
  switch (type) {
    case "SET_FORM":
      return { ...state, ...payload }
    case "SET_ROLL": {
      const diceRoll = getNewNumpadValue(state.diceRoll, payload)
      return { ...state, diceRoll }
    }
    case "RESET":
      return defaultReactionForm
    default: {
      throw Error(`Unknown action: ${type}`)
    }
  }
}

export function ReactionProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, defaultReactionForm)

  const api = useMemo(
    () => ({
      setReactionForm: (payload: Partial<ReactionStateContext>) => {
        dispatch({ type: "SET_FORM", payload })
      },
      setReactionRoll: (payload: string) => {
        dispatch({ type: "SET_ROLL", payload })
      },
      reset: () => {
        dispatch({ type: "RESET", payload: undefined })
      }
    }),
    []
  )

  return (
    <ReactionContextForm.Provider value={state}>
      <ReactionContextApi.Provider value={api}>{children}</ReactionContextApi.Provider>
    </ReactionContextForm.Provider>
  )
}

export const useReactionForm = () => {
  const context = useContext(ReactionContextForm)
  if (!context) {
    throw new Error("useReactionForm must be used within an ReactionProvider")
  }
  return context
}
export const useReactionApi = () => {
  const context = useContext(ReactionContextApi)
  if (!context) {
    throw new Error("useReactionForm must be used within an ReactionProvider")
  }
  return context
}
