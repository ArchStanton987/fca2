import { createContext, useContext, useMemo } from "react"

import Character from "lib/character/Character"
import { DbCombatEntry, PlayerData } from "lib/combat/combats.types"
import NonHuman from "lib/npc/NonHuman"

import { useCharacter } from "contexts/CharacterContext"
import { useSquad } from "contexts/SquadContext"
import useCreatedElements from "hooks/context/useCreatedElements"
import useRtdbSub from "hooks/db/useRtdbSub"
import useRtdbSubs from "hooks/db/useRtdbSubs"

import { useGetUseCases } from "./UseCasesProvider"

type CombatContextType = {
  combat: DbCombatEntry | null
  players: Record<string, PlayerData> | null
  enemies: Record<string, PlayerData> | null
}

const defaultCombatContext: CombatContextType = {
  combat: null,
  players: null,
  enemies: null
}

const CombatContext = createContext<CombatContextType>(defaultCombatContext)

export default function CombatProvider({ children }: { children: React.ReactNode }) {
  const useCases = useGetUseCases()
  const createdElements = useCreatedElements()
  const squad = useSquad()
  const { status } = useCharacter()

  const combatId = status.currentCombatId ?? ""
  const combat = useRtdbSub(useCases.combat.sub({ id: combatId }))

  const playersIds = useMemo(() => Object.keys(combat?.players ?? {}), [combat])
  const playersSubs = useMemo(
    () => useCases.character.subCharacters(playersIds).map((s, i) => ({ ...s, id: playersIds[i] })),
    [playersIds, useCases]
  )
  const playersData = useRtdbSubs(playersSubs)

  const players = useMemo(() => {
    if (!playersData || !combat) return null
    const characters: Record<string, PlayerData> = {}
    Object.entries(playersData).forEach(([key, value]) => {
      const char = new Character(key, value, squad, createdElements)
      const combatData = combat.players[key]
      const currMaxAp = char.secAttr.curr.actionPoints
      characters[key] = { ...char.status, ...combatData, currMaxAp }
    })
    return characters
  }, [playersData, combat, squad, createdElements])

  const enemiesIds = useMemo(() => Object.keys(combat?.enemies ?? {}), [combat])
  const enemiesSubs = useMemo(
    () => useCases.npc.subNpcs(enemiesIds).map((s, i) => ({ ...s, id: enemiesIds[i] })),
    [enemiesIds, useCases]
  )
  const enemiesData = useRtdbSubs(enemiesSubs)

  const enemies = useMemo(() => {
    if (!enemiesData || !combat) return null
    const foes: Record<string, PlayerData> = {}
    Object.entries(enemiesData).forEach(([key, value]) => {
      const combatData = combat.enemies[key]
      if ("abilities" in value) {
        const char = new Character(key, value, squad, createdElements)
        const currMaxAp = char.secAttr.curr.actionPoints
        foes[key] = { ...char.status, ...combatData, currMaxAp }
        return
      }
      const nonHuman = new NonHuman(key, value, squad)
      foes[key] = { ...value.status, ...combatData, currMaxAp: nonHuman.data.actionPoints }
    })
    return foes
  }, [enemiesData, combat, squad, createdElements])

  const value = useMemo(
    () => ({ combat: combat ?? null, players, enemies }),
    [combat, players, enemies]
  )

  return <CombatContext.Provider value={value}>{children}</CombatContext.Provider>
}

export const useCombat = () => {
  const context = useContext(CombatContext)
  if (!context) {
    throw new Error("useCombat must be used within a CombatProvider")
  }
  return context
}
