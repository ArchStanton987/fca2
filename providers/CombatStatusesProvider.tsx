import { ReactNode, createContext, useContext } from "react"

import { CombatStatus } from "lib/character/combat-status/combat-status.types"
import { useContendersCombatStatus } from "lib/character/combat-status/use-cases/sub-combat-status"

import Txt from "components/Txt"
import LoadingScreen from "screens/LoadingScreen"

import { useCombat } from "./CombatProvider"

type CombatStatusesContextType = Record<string, CombatStatus>
const CombatStatusesContext = createContext<CombatStatusesContextType>({})

export function CombatStatusesProvider({ children }: { children: ReactNode }) {
  const contendersIds = useCombat()?.contendersIds ?? []
  const combatStatusesSub = useContendersCombatStatus(contendersIds)

  if (combatStatusesSub.isPending) return <LoadingScreen />
  if (combatStatusesSub.isError)
    return <Txt>Erreur lors de la récupération du statut de combat</Txt>

  return (
    <CombatStatusesContext.Provider value={combatStatusesSub.data}>
      {children}
    </CombatStatusesContext.Provider>
  )
}

export function useCombatStatuses(): CombatStatusesContextType
export function useCombatStatuses(id: string): CombatStatus
export function useCombatStatuses(id?: string) {
  const combatStatuses = useContext(CombatStatusesContext)
  if (combatStatuses === undefined) throw new Error("CombatStatusesContext not found")
  if (!id) return combatStatuses
  if (!(id in combatStatuses)) throw new Error(`No combat status found for id ${id}`)
  return combatStatuses[id]
}
