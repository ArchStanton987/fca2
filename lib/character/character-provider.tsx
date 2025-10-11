import { ReactNode } from "react"

import { useSubPlayablesAbilities } from "./abilities/abilities-provider"
import { useSubPlayablesBaseSpecial } from "./abilities/base-special-provider"
import { useSubPlayablesCombatStatus } from "./combat-status/combat-status-provider"
import { useSubPlayablesEffects } from "./effects/effects-provider"
import { useSubPlayablesHealth } from "./health/health-provider"
import { useSubPlayablesCharInfo } from "./info/info-provider"
import { useSubPlayablesExp } from "./progress/exp-provider"

export default function CharSubsProvider({
  children,
  playablesIds,
  datetime
}: {
  children: ReactNode
  playablesIds: string[]
  datetime: Date
}) {
  useSubPlayablesCharInfo(playablesIds)
  useSubPlayablesBaseSpecial(playablesIds)
  useSubPlayablesExp(playablesIds)
  useSubPlayablesHealth(playablesIds)
  useSubPlayablesAbilities(playablesIds)
  useSubPlayablesEffects(playablesIds, datetime)
  useSubPlayablesCombatStatus(playablesIds)

  return children
}
