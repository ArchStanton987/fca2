import { createContext, useMemo } from "react"

import Character from "lib/character/Character"
import { PlayerData } from "lib/combat/combats.types"

import { useCharacter } from "contexts/CharacterContext"
import { useSquad } from "contexts/SquadContext"
import useCreatedElements from "hooks/context/useCreatedElements"
import useRtdbSub from "hooks/db/useRtdbSub"
import useRtdbSubs from "hooks/db/useRtdbSubs"

import { useGetUseCases } from "./UseCasesProvider"

const CombatContext = createContext({})

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
      const char = new Character(value, squad, key, createdElements)
      const combatData = combat.players[key]
      const currMaxAp = char.secAttr.curr.actionPoints
      characters[key] = { ...char.status, ...combatData, currMaxAp }
    })
    return characters
  }, [playersData, combat, squad, createdElements])

  const enemiesIds = useMemo(() => Object.keys(combat?.enemies ?? {}), [combat])
  const enemiesSubs = useMemo(
    () => useCases.enemy.subEnemies(enemiesIds).map((s, i) => ({ ...s, id: enemiesIds[i] })),
    [enemiesIds, useCases]
  )
  const enemiesData = useRtdbSubs(enemiesSubs)

  const enemies = useMemo(() => {
    if (!enemiesData || !combat) return null
    const foes: Record<string, PlayerData> = {}
    Object.entries(enemiesData).forEach(([key, value]) => {
      const combatData = combat.enemies[key]
      if (value.enemyType === "human") {
        const s = { date: squad.date, squadId: combat.title }
        const char = new Character(value, s, key, createdElements)
        const currMaxAp = char.secAttr.curr.actionPoints
        foes[key] = { ...char.status, ...combatData, currMaxAp }
        return
      }
      const currMaxAp = value.actionPoints
      foes[key] = { ...value.status, ...combatData, currMaxAp }
    })
    return foes
  }, [enemiesData, combat, squad, createdElements])

  const value = useMemo(() => ({ combat, players, enemies }), [combat, players, enemies])

  if (!combat) return children

  return <CombatContext.Provider value={value}>{children}</CombatContext.Provider>
}
