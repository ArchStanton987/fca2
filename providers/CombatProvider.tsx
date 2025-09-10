import { createContext, useContext, useMemo } from "react"

import Combat from "lib/combat/Combat"
import { useSubCombatHistory, useSubCombatInfo } from "lib/combat/use-cases/sub-combat"

import { useSquad } from "contexts/SquadContext"

import { useCombatStatus } from "./CombatStatusProvider"

type CombatContextType = Combat | null

const defaultCombatContext: CombatContextType = null

const CombatContext = createContext<CombatContextType>(defaultCombatContext)

export default function CombatProvider({ children }: { children: React.ReactNode }) {
  const squad = useSquad()

  const combatId = useCombatStatus()?.combatId ?? ""
  const combatHistoryReq = useSubCombatHistory(combatId)
  const combatInfoReq = useSubCombatInfo(combatId)

  const combat = useMemo(() => {
    if (!combatInfoReq.data) return null
    return new Combat({
      history: combatHistoryReq.data ?? {},
      ...combatInfoReq.data,
      id: combatId,
      gameId: squad.squadId
    })
  }, [combatHistoryReq, combatInfoReq, squad.squadId, combatId])

  return <CombatContext.Provider value={combat}>{children}</CombatContext.Provider>
}

export const useCombat = () => {
  const context = useContext(CombatContext)
  if (context === undefined) {
    throw new Error("useCombat must be used within a CombatProvider")
  }
  return context
}
