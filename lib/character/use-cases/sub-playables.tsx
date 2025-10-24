import { ReactNode } from "react"

import { useMultiSubAmmo, useMultiSubCaps, useMultiSubItems } from "lib/inventory/use-sub-inv-cat"

import { useSubPlayablesAbilities } from "../abilities/abilities-provider"
import { useSubPlayablesBaseSpecial } from "../abilities/base-special-provider"
import { useSubPlayablesCombatHistory } from "../combat-history/combat-history-provider"
import { useSubPlayablesCombatStatus } from "../combat-status/combat-status-provider"
import { useSubPlayablesEffects } from "../effects/effects-provider"
import { useSubPlayablesHealth } from "../health/health-provider"
import { useSubPlayablesCharInfo } from "../info/info-provider"
import { useSubPlayablesExp } from "../progress/exp-provider"

export default function SubPlayables({
  children,
  playablesIds,
  datetime
}: {
  children: ReactNode
  playablesIds: string[]
  datetime: Date
}) {
  // Inventory
  useMultiSubCaps(playablesIds)
  useMultiSubAmmo(playablesIds)
  useMultiSubItems(playablesIds)

  // Playable
  useSubPlayablesCharInfo(playablesIds)
  useSubPlayablesBaseSpecial(playablesIds)
  useSubPlayablesExp(playablesIds)
  useSubPlayablesHealth(playablesIds)
  useSubPlayablesAbilities(playablesIds)
  useSubPlayablesEffects(playablesIds, datetime)
  useSubPlayablesCombatStatus(playablesIds)
  useSubPlayablesCombatHistory(playablesIds)

  return children
}
