import { ReactNode, createContext, useContext } from "react"

import { CombatStatus } from "lib/character/combat-status/combat-status.types"
import { useCharCombatStatus } from "lib/character/combat-status/use-cases/sub-combat-status"

import Txt from "components/Txt"
import LoadingScreen from "screens/LoadingScreen"

type CombatStatusContextType = CombatStatus
const CombatStatusContext = createContext<CombatStatusContextType>({} as CombatStatusContextType)

export function CombatStatusProvider({
  children,
  charId
}: {
  children: ReactNode
  charId: string
}) {
  const combatStatusSub = useCharCombatStatus(charId)

  if (combatStatusSub.isPending) return <LoadingScreen />
  if (combatStatusSub.isError) return <Txt>Erreur lors de la récupération du statut de combat</Txt>

  return (
    <CombatStatusContext.Provider value={combatStatusSub.data}>
      {children}
    </CombatStatusContext.Provider>
  )
}

export function useCombatStatus() {
  const combatStatus = useContext(CombatStatusContext)
  if (!combatStatus) throw new Error("CombatStatusContext not found")
  return combatStatus
}
