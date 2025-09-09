import { createContext, useContext, useMemo } from "react"

import Character from "lib/character/Character"
import { useCurrCharId } from "lib/character/character-store"
import { useCharCombatStatus } from "lib/character/combat-status/use-cases/sub-combat-status"
import Combat from "lib/combat/Combat"
import { useSubCombatHistory, useSubCombatInfo } from "lib/combat/use-cases/sub-combat"
import NonHuman from "lib/npc/NonHuman"

import { useSquad } from "contexts/SquadContext"
import useCreatedElements from "hooks/context/useCreatedElements"
import useRtdbSubs from "hooks/db/useRtdbSubs"

import { useGetUseCases } from "./UseCasesProvider"

type CombatContextType = {
  combat: Combat | null
  contenders: Record<string, Character | NonHuman> | null
}

const defaultCombatContext: CombatContextType = {
  combat: null,
  contenders: null
}

const CombatContext = createContext<CombatContextType>(defaultCombatContext)

export default function CombatProvider({ children }: { children: React.ReactNode }) {
  const useCases = useGetUseCases()
  const createdElements = useCreatedElements()
  const squad = useSquad()

  const charId = useCurrCharId()
  const combatId = useCharCombatStatus(charId)?.data?.combatId ?? ""
  const combatHistoryReq = useSubCombatHistory(combatId)
  const combatInfoReq = useSubCombatInfo(combatId)

  const contendersIds = useMemo(() => Object.keys(combatInfoReq.data ?? {}), [combatInfoReq])
  const contendersSub = useMemo(
    () =>
      useCases.character
        .subCharacters(contendersIds)
        .map((s, i) => ({ ...s, id: contendersIds[i] })),
    [contendersIds, useCases]
  )
  const contendersData = useRtdbSubs(contendersSub)

  const contenders = useMemo(() => {
    if (!contendersData) return null
    const result: Record<string, Character | NonHuman> = {}
    Object.entries(contendersData).forEach(([key, value]) => {
      if ("abilities" in value) {
        const char = new Character(key, value, squad, createdElements)
        result[key] = char
        return
      }
      const char = new NonHuman(key, value, squad)
      result[key] = char
    })
    return result
  }, [contendersData, squad, createdElements])

  const combat = useMemo(() => {
    if (!combatInfoReq.data) return null
    return new Combat({
      history: combatHistoryReq.data ?? {},
      ...combatInfoReq.data,
      id: combatId,
      gameId: squad.squadId
    })
  }, [combatHistoryReq, combatInfoReq, squad.squadId, combatId])

  const value = useMemo(() => ({ combat, contenders }), [combat, contenders])

  return <CombatContext.Provider value={value}>{children}</CombatContext.Provider>
}

export const useCombat = () => {
  const context = useContext(CombatContext)
  if (!context) {
    throw new Error("useCombat must be used within a CombatProvider")
  }
  return context
}
