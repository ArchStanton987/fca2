import { ReactNode, createContext, useContext, useMemo } from "react"

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
  ids
}: {
  children: ReactNode
  ids: string[]
}) {
  useSubPlayablesCharInfo(ids)
  const charInfoData = usePlayablesCharInfo(ids).data

  useSubPlayablesAbilities(ids)
  const abilitiesData = usePlayablesAbilities(ids).data

  useSubPlayablesProgress(ids)
  const progressData = usePlayablesProgress(ids).data

  useSubPlayablesHealth(ids)
  const healthData = usePlayablesHealth(ids).data

  useSubPlayablesCombatStatus(ids)
  const combatStatusData = usePlayablesCombatStatus(ids).data

  useSubPlayablesEffects(ids)
  const effectsData = usePlayablesEffects(ids).data

  const playables = useMemo(
    () =>
      Object.fromEntries(
        ids
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
    [abilitiesData, charInfoData, combatStatusData, effectsData, healthData, ids, progressData]
  )

  if (Object.keys(playables).length !== ids.length) return <LoadingScreen />

  return <PlayablesContext.Provider value={playables}>{children}</PlayablesContext.Provider>
}

export function usePlayables(): Record<string, Character>
export function usePlayables(id: string): Character
export function usePlayables(id?: string) {
  const playables = useContext(PlayablesContext)
  if (!playables) throw new Error("Could not fint PlayablesContext")
  if (!id) return playables
  if (!playables[id]) throw new Error(`Playable with id ${id} could not be found`)
  return playables[id]
}
