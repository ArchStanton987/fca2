import { ReactNode, createContext, useContext, useMemo } from "react"

import Action from "lib/combat/Action"
import { useSubCombatState } from "lib/combat/use-cases/sub-combat"

import Txt from "components/Txt"

import { useCombatStatus } from "./CombatStatusProvider"

type CombatStateType = {
  action: Action
  actorIdOverride?: string | null
}

const defaultCombatStateContext: CombatStateType = {
  action: new Action({})
}

const CombatStateContext = createContext<CombatStateType>(defaultCombatStateContext)

export default function CombatStateProvider({
  children,
  charId
}: {
  children: ReactNode
  charId: string
}) {
  const { combatId } = useCombatStatus(charId)
  const combatStateReq = useSubCombatState(combatId ?? "")

  const context = useMemo(
    () => ({
      action: combatStateReq.data?.action ?? new Action({}),
      actorIdOverride: combatStateReq.data?.actorIdOverride
    }),
    [combatStateReq.data]
  )

  if (combatStateReq.error)
    return <Txt>Erreur lors de la récupération de l&apos;action en cours</Txt>

  return <CombatStateContext.Provider value={context}>{children}</CombatStateContext.Provider>
}

export function useCombatState() {
  const combatState = useContext(CombatStateContext)
  if (!combatState) throw new Error("CombatStateContext could not be found")
  return combatState
}
