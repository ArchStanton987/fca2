import { createContext, useContext, useMemo } from "react"

import Character from "lib/character/Character"
import Combat from "lib/combat/Combat"
import { PlayerCombatData } from "lib/combat/combats.types"
import NonHuman from "lib/npc/NonHuman"

import { useCharacter } from "contexts/CharacterContext"
import { useSquad } from "contexts/SquadContext"
import useCreatedElements from "hooks/context/useCreatedElements"
import useRtdbSub from "hooks/db/useRtdbSub"
import useRtdbSubs from "hooks/db/useRtdbSubs"

import { useGetUseCases } from "./UseCasesProvider"

type PlayerData = { char: Character | NonHuman; combatData: PlayerCombatData }

type CombatContextType = {
  combat: Combat | null
  players: Record<string, PlayerData> | null
  npcs: Record<string, PlayerData> | null
}

const defaultCombatContext: CombatContextType = {
  combat: null,
  players: null,
  npcs: null
}

const CombatContext = createContext<CombatContextType>(defaultCombatContext)

export default function CombatProvider({ children }: { children: React.ReactNode }) {
  const useCases = useGetUseCases()
  const createdElements = useCreatedElements()
  const squad = useSquad()
  const { status } = useCharacter()

  const combatId = status.currentCombatId ?? ""
  const dbCombat = useRtdbSub(useCases.combat.sub({ id: combatId }))

  const playersIds = useMemo(() => Object.keys(dbCombat?.players ?? {}), [dbCombat])
  const playersSubs = useMemo(
    () => useCases.character.subCharacters(playersIds).map((s, i) => ({ ...s, id: playersIds[i] })),
    [playersIds, useCases]
  )
  const playersData = useRtdbSubs(playersSubs)

  const players = useMemo(() => {
    if (!playersData || !dbCombat) return null
    const characters: Record<string, PlayerData> = {}
    Object.entries(playersData).forEach(([key, value]) => {
      const char = new Character(key, value, squad, createdElements)
      const combatData = dbCombat.players[key]
      characters[key] = { char, combatData }
    })
    return characters
  }, [playersData, dbCombat, squad, createdElements])

  const npcIds = useMemo(() => Object.keys(dbCombat?.npcs ?? {}), [dbCombat])
  const npcSubs = useMemo(
    () => useCases.npc.subNpcs(npcIds).map((s, i) => ({ ...s, id: npcIds[i] })),
    [npcIds, useCases]
  )
  const npcsDatas = useRtdbSubs(npcSubs)

  const npcs = useMemo(() => {
    if (!npcsDatas || !dbCombat) return null
    const result: Record<string, PlayerData> = {}
    Object.entries(npcsDatas).forEach(([key, value]) => {
      const combatData = dbCombat.npcs[key]
      if ("abilities" in value) {
        const char = new Character(key, value, squad, createdElements)
        result[key] = { char, combatData }
        return
      }
      const char = new NonHuman(key, value, squad)
      result[key] = { char, combatData }
    })
    return result
  }, [npcsDatas, dbCombat, squad, createdElements])

  const combat = useMemo(() => {
    if (!dbCombat) return null
    return new Combat({ ...dbCombat, id: combatId })
  }, [dbCombat, combatId])

  const value = useMemo(() => ({ combat: combat ?? null, players, npcs }), [combat, players, npcs])

  return <CombatContext.Provider value={value}>{children}</CombatContext.Provider>
}

export const useCombat = () => {
  const context = useContext(CombatContext)
  if (!context) {
    throw new Error("useCombat must be used within a CombatProvider")
  }
  return context
}
