import { ReactNode, createContext, useContext } from "react"

import { CombatStatus } from "lib/character/combat-status/combat-status.types"
import { useContendersCombatStatus } from "lib/character/combat-status/use-cases/sub-combat-status"

import Txt from "components/Txt"
import LoadingScreen from "screens/LoadingScreen"

import { useCombat } from "./CombatProvider"

type CombatStatusContextType = Record<string, CombatStatus>
const CombatStatusContext = createContext<CombatStatusContextType>({})

export default function CombatStatusesProvider({ children }: { children: ReactNode }) {
  const contendersIds = useCombat()?.contendersIds ?? []
  const combatStatusSub = useContendersCombatStatus(contendersIds)

  if (combatStatusSub.isPending) return <LoadingScreen />
  if (combatStatusSub.isError) return <Txt>Erreur lors de la récupération du statut de combat</Txt>

  return (
    <CombatStatusContext.Provider value={combatStatusSub.data}>
      {children}
    </CombatStatusContext.Provider>
  )
}

export function useCombatStatus(): CombatStatusContextType
export function useCombatStatus(id: string): CombatStatus
export function useCombatStatus<R = CombatStatus>(id: string, select: (state: CombatStatus) => R): R
export function useCombatStatus(
  id?: string,
  select?: (state: CombatStatus) => any
): CombatStatusContextType | any {
  const combatStatus = useContext(CombatStatusContext)
  if (!combatStatus) throw new Error("CombatStatusContext not found")
  if (!id) return combatStatus
  return select ? select(combatStatus[id]) : combatStatus[id]
}
