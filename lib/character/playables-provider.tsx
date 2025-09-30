import { ReactNode, createContext } from "react"

import Character from "./Character"
import { usePlayablesAbilities, useSubPlayablesAbilities } from "./abilities/abilities-provider"
import {
  usePlayablesCombatStatus,
  useSubPlayablesCombatStatus
} from "./combat-status/use-cases/sub-combat-status"
import { usePlayablesHealth, useSubPlayablesHealth } from "./health/health-provider"
import { usePlayablesCharInfo, useSubPlayablesCharInfo } from "./info/info-provider"
import { usePlayablesProgress, useSubPlayablesProgress } from "./progress/progress-provider"

const PlayablesContext = createContext({} as Record<string, Character>)

export default function PlayablesProvider({
  children,
  playablesIds
}: {
  children: ReactNode
  playablesIds: string[]
}) {
  useSubPlayablesCharInfo(playablesIds)
  const charInfoReq = usePlayablesCharInfo(playablesIds)

  useSubPlayablesAbilities(playablesIds)
  const abilitiesReq = usePlayablesAbilities(playablesIds)

  useSubPlayablesProgress(playablesIds)
  const progressReq = usePlayablesProgress(playablesIds)

  useSubPlayablesHealth(playablesIds)
  const healthReq = usePlayablesHealth(playablesIds)

  useSubPlayablesCombatStatus(playablesIds)
  const combatStatusReq = usePlayablesCombatStatus(playablesIds)

  // EFFECTS
  // USE SUB COLLECTIONS

  return <PlayablesContext.Provider value={{}}>{children}</PlayablesContext.Provider>
}
