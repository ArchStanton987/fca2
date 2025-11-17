import { ReactNode } from "react"

import { useLocalSearchParams } from "expo-router"

import { useMultiSubAmmo, useMultiSubCaps, useMultiSubItems } from "lib/inventory/use-sub-inv-cat"
import { useDatetime } from "lib/squad/use-cases/sub-squad"

import LoadingScreen from "screens/LoadingScreen"

import { useSubPlayablesAbilities } from "../abilities/abilities-provider"
import { useSubPlayablesBaseSpecial } from "../abilities/base-special-provider"
import { useSubPlayablesCombatHistory } from "../combat-history/combat-history-provider"
import { useSubPlayablesCombatStatus } from "../combat-status/combat-status-provider"
import { useSubPlayablesEffects } from "../effects/effects-provider"
import { useSubPlayablesHealth } from "../health/health-provider"
import { useSubPlayablesCharInfo } from "../info/info-provider"
import { useSubPlayablesExp } from "../progress/exp-provider"

function FirstProviders({ children, ids }: { children: ReactNode; ids: string[] }) {
  const { squadId } = useLocalSearchParams<{ squadId: string }>()
  const { data: datetime } = useDatetime(squadId)

  // Inventory
  const capsReq = useMultiSubCaps(ids)
  const ammoReq = useMultiSubAmmo(ids)
  const itemsReq = useMultiSubItems(ids)

  // Playable
  const infoReq = useSubPlayablesCharInfo(ids)
  const baseSpecialReq = useSubPlayablesBaseSpecial(ids)
  const expReq = useSubPlayablesExp(ids)
  const effectsReq = useSubPlayablesEffects(ids, datetime)
  const csReq = useSubPlayablesCombatStatus(ids)
  const chReq = useSubPlayablesCombatHistory(ids)

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

  const isLoading = data.some(d => d.some(q => q.isPending))
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

export default function SubPlayables({
  children,
  playablesIds
}: {
  children: ReactNode
  playablesIds: string[]
}) {
  return (
    <FirstProviders ids={playablesIds}>
      <SecProviders ids={playablesIds}>
        <TerProviders ids={playablesIds}>{children}</TerProviders>
      </SecProviders>
    </FirstProviders>
  )
}
