import React, { createContext, useContext, useMemo, useReducer } from "react"

export type ReactionStateContext = {
  // charId: string
  reaction: "none" | "parry" | "dodge"
  diceRoll: number
  // skillScore: number
  // skillId?: SkillId
  // apCost: number
  // armorClass: number
}

type ReactionApiContext = {
  setReactionForm: (e: Partial<ReactionStateContext>) => void
  reset: () => void
}

export const defaultReactionForm = {
  // charId: "",
  reaction: "none",
  diceRoll: 0
  // skillScore: 0,
  // apCost: 0,
  // armorClass: 0
} as const

const ReactionContextForm = createContext<ReactionStateContext>({} as ReactionStateContext)
const ReactionContextApi = createContext<ReactionApiContext>({} as ReactionApiContext)

type Action =
  | { type: "SET_FORM"; payload: Partial<ReactionStateContext> }
  | { type: "RESET"; payload: undefined }

const reducer = (state: ReactionStateContext, { type, payload }: Action): ReactionStateContext => {
  switch (type) {
    case "SET_FORM":
      return { ...state, ...payload }
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
