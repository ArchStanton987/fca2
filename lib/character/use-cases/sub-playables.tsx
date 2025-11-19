import { ReactNode, memo } from "react"

import { useMultiSubAmmo, useMultiSubCaps, useMultiSubItems } from "lib/inventory/use-sub-inv-cat"

import LoadingScreen from "screens/LoadingScreen"

import { useSubPlayablesAbilities } from "../abilities/abilities-provider"
import { useSubPlayablesBaseSpecial } from "../abilities/base-special-provider"
import { useSubPlayablesCombatHistory } from "../combat-history/combat-history-provider"
import { useSubPlayablesCombatStatus } from "../combat-status/combat-status-provider"
import { useSubPlayablesEffects } from "../effects/effects-provider"
import { useSubPlayablesHealth } from "../health/health-provider"
import { useSubPlayablesCharInfo } from "../info/info-provider"
import { useSubPlayablesExp } from "../progress/exp-provider"

function FirstProviders({
  children,
  ids,
  datetime
}: {
  children: ReactNode
  ids: string[]
  datetime: string
}) {
  // Inventory
  const capsReq = useMultiSubCaps(ids).some(r => r.isPending)
  const ammoReq = useMultiSubAmmo(ids).some(r => r.isPending)
  const itemsReq = useMultiSubItems(ids).some(r => r.isPending)

  // Playable
  const infoReq = useSubPlayablesCharInfo(ids).some(r => r.isPending)
  const baseSpecialReq = useSubPlayablesBaseSpecial(ids).some(r => r.isPending)
  const expReq = useSubPlayablesExp(ids).some(r => r.isPending)
  const effectsReq = useSubPlayablesEffects(ids, new Date(datetime)).some(r => r.isPending)
  const csReq = useSubPlayablesCombatStatus(ids).some(r => r.isPending)
  const chReq = useSubPlayablesCombatHistory(ids).some(r => r.isPending)

  const data = [
    capsReq,
    ammoReq,
    itemsReq,
    infoReq,
    baseSpecialReq,
    expReq,
    effectsReq,
    csReq,
    chReq
  ]

  const isLoading = data.some(d => !!d)
  if (isLoading) return <LoadingScreen />
  return children
}

function SecProviders({ children, ids }: { children: ReactNode; ids: string[] }) {
  const healthReq = useSubPlayablesHealth(ids)
  const isLoading = healthReq.some(q => q.isPending)
  if (isLoading) return <LoadingScreen />
  return children
}

function TerProviders({ children, ids }: { children: ReactNode; ids: string[] }) {
  const abilitiesReq = useSubPlayablesAbilities(ids)
  const allData = [abilitiesReq]
  const isLoading = allData.some(d => d.some(q => q.isPending))
  if (isLoading) return <LoadingScreen />
  return children
}

function SubPlayables({
  children,
  playablesIds,
  datetime
}: {
  children: ReactNode
  playablesIds: string[]
  datetime: string
}) {
  return (
    <FirstProviders ids={playablesIds} datetime={datetime}>
      <SecProviders ids={playablesIds}>
        <TerProviders ids={playablesIds}>{children}</TerProviders>
      </SecProviders>
    </FirstProviders>
  )
}

export default memo(SubPlayables)
