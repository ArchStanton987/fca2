import { ReactNode, createContext, useMemo } from "react"

import LoadingScreen from "screens/LoadingScreen"

import Character from "./Character"
import { usePlayablesAbilities, useSubPlayablesAbilities } from "./abilities/abilities-provider"
import {
  usePlayablesCombatStatus,
  useSubPlayablesCombatStatus
} from "./combat-status/use-cases/sub-combat-status"
import { usePlayablesEffects, useSubPlayablesEffects } from "./effects/effects-provider"
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
  const charInfoData = usePlayablesCharInfo(playablesIds).data

  useSubPlayablesAbilities(playablesIds)
  const abilitiesData = usePlayablesAbilities(playablesIds).data

  useSubPlayablesProgress(playablesIds)
  const progressData = usePlayablesProgress(playablesIds).data

  useSubPlayablesHealth(playablesIds)
  const healthData = usePlayablesHealth(playablesIds).data

  useSubPlayablesCombatStatus(playablesIds)
  const combatStatusData = usePlayablesCombatStatus(playablesIds).data

  useSubPlayablesEffects(playablesIds)
  const effectsData = usePlayablesEffects(playablesIds).data

  const playables = useMemo(
    () =>
      Object.fromEntries(
        playablesIds
          .map((id, i) => {
            const info = charInfoData[i]
            const abilities = abilitiesData[i]
            const progress = progressData[i]
            const health = healthData[i]
            const combatStatus = combatStatusData[i]
            const effects = effectsData[i]
            if (!info || !abilities || !progress || !health || !combatStatus || !effects)
              return [id, undefined]
            const payload = { info, abilities, progress, health, combatStatus, effects }
            return [id, new Character(payload)]
          })
          .filter(([, value]) => !!value)
      ),
    [
      abilitiesData,
      charInfoData,
      combatStatusData,
      effectsData,
      healthData,
      playablesIds,
      progressData
    ]
  )

  if (Object.keys(playables).length !== playablesIds.length) return <LoadingScreen />

  return <PlayablesContext.Provider value={playables}>{children}</PlayablesContext.Provider>
}
