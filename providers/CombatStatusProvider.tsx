import { ReactNode, createContext, useContext } from "react"

import { useCurrCharId } from "lib/character/character-store"
import { CombatStatus } from "lib/character/combat-status/combat-status.types"
import { useSubCombatStatus } from "lib/character/combat-status/use-cases/sub-combat-status"

import Txt from "components/Txt"
import LoadingScreen from "screens/LoadingScreen"

type CombatStatusContextType = CombatStatus
const CombatStatusContext = createContext<CombatStatusContextType>(new CombatStatus({ currAp: 0 }))

export default function CombatStatusProvider({ children }: { children: ReactNode }) {
  const charId = useCurrCharId()
  const combatStatusSub = useSubCombatStatus(charId)

  if (combatStatusSub.isPending) return <LoadingScreen />
  if (combatStatusSub.isError) return <Txt>Erreur lors de la récupération du statut de combat</Txt>

  return (
    <CombatStatusContext.Provider value={combatStatusSub.data}>
      {children}
    </CombatStatusContext.Provider>
  )
}

export const useCombatStatus = () => {
  const combatStatus = useContext(CombatStatusContext)
  if (!combatStatus) throw new Error("CombatStatusContext not found")
  return combatStatus
}
