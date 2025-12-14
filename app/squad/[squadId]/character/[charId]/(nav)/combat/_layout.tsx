import { ReactNode } from "react"
import { View } from "react-native"

import { Stack, useLocalSearchParams } from "expo-router"

import { useQueries, useQuery } from "@tanstack/react-query"
import { useCombatStatus } from "lib/character/combat-status/combat-status-provider"
import { useCharInfo } from "lib/character/info/info-provider"
import SubPlayables, { getPlayableOptions } from "lib/character/use-cases/sub-playables"
import { SubCombats, getCombatOptions } from "lib/combat/use-cases/sub-combats"

import Drawer from "components/Drawer/Drawer"
import Spacer from "components/Spacer"
import { ActionFormProvider } from "providers/ActionFormProvider"
import LoadingScreen from "screens/LoadingScreen"
import styles from "styles/DrawerLayout.styles"
import colors from "styles/colors"
import layout from "styles/layout"

const pNavElements = [
  { path: "combat-recap", label: "Recap" },
  { path: "action", label: "Action" }
]
const gmNavElements = [
  { path: "combat-recap", label: "Recap" },
  { path: "action-order", label: "MJ (ordre)" },
  { path: "gm-action", label: "MJ (action)" },
  { path: "gm-difficulty", label: "MJ (diff)" },
  { path: "gm-damage", label: "MJ (dég)" }
]
const getNav = (isGm: boolean, hasCombat: boolean) => {
  if (!hasCombat) return [{ path: "recap", label: "Recap" }]
  if (!isGm) return pNavElements
  return gmNavElements
}

function Loader({ combatId, children }: { combatId: string; children: ReactNode }) {
  const { data: contendersIds = [] } = useQuery({
    ...getCombatOptions(combatId),
    select: combat => combat.contendersIds
  })
  const isContendersPending = useQueries({
    queries: contendersIds.flatMap(id => getPlayableOptions(id)),
    combine: r => r.some(q => q.isPending)
  })
  const combatQuery = useQuery(getCombatOptions(combatId))
  const isCombatPending = combatQuery.isEnabled && combatQuery.isPending
  if (isContendersPending || isCombatPending) return <LoadingScreen />
  return children
}

function SubContenders({
  squadId,
  combatId,
  charId
}: {
  squadId: string
  combatId: string
  charId: string
}) {
  const { data: contendersIds = [] } = useQuery({
    ...getCombatOptions(combatId),
    select: combat => combat.contendersIds.filter(c => c !== charId)
  })
  return <SubPlayables playablesIds={contendersIds} squadId={squadId} />
}

function CombatProvider({
  children,
  squadId,
  charId
}: {
  children: ReactNode
  squadId: string
  charId: string
}) {
  const { data: combatId = "" } = useCombatStatus(charId, cs => cs.combatId)
  return (
    <>
      <SubCombats ids={[combatId]} />
      <SubContenders squadId={squadId} combatId={combatId} charId={charId} />
      <Loader combatId={combatId}>
        <ActionFormProvider combatId={combatId}>{children}</ActionFormProvider>
      </Loader>
    </>
  )
}

export default function CombatLayout() {
  const { charId, squadId } = useLocalSearchParams<{ charId: string; squadId: string }>()
  const { data: isGameMaster } = useCharInfo(charId, info => info.isNpc)
  const { data: isInCombat } = useCombatStatus(charId, data => data.combatId !== "")
  const navElements = getNav(isGameMaster, isInCombat)

  return (
    <CombatProvider squadId={squadId} charId={charId}>
      <View style={styles.drawerLayout}>
        <Drawer sectionId="combat" navElements={navElements} />
        <Spacer x={layout.globalPadding} />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.primColor, padding: 0 }
          }}
        >
          <Stack.Protected guard={!isInCombat}>
            <Stack.Screen name="recap" />
          </Stack.Protected>
          <Stack.Protected guard={isInCombat}>
            <Stack.Screen name="combat-recap" />
          </Stack.Protected>
          <Stack.Protected guard={!isGameMaster}>
            <Stack.Screen name="action" />
          </Stack.Protected>
          <Stack.Protected guard={isGameMaster}>
            <Stack.Screen name="action-order" />
            <Stack.Screen name="gm-action" />
            <Stack.Screen name="gm-difficulty" />
            <Stack.Screen name="gm-damage" />
          </Stack.Protected>
        </Stack>
      </View>
    </CombatProvider>
  )
}
