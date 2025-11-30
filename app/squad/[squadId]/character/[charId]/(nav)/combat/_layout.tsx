import { ReactNode, useMemo } from "react"
import { View } from "react-native"

import { Stack, useLocalSearchParams } from "expo-router"

import { useQueries, useQuery } from "@tanstack/react-query"
import { useCombatStatus } from "lib/character/combat-status/combat-status-provider"
import { useCharInfo } from "lib/character/info/info-provider"
import SubPlayables from "lib/character/use-cases/sub-playables"
import { SubCombats, getCombatOptions } from "lib/combat/use-cases/sub-combats"
import { useSquadMembers } from "lib/squad/use-cases/sub-squad"

import Drawer from "components/Drawer/Drawer"
import Spacer from "components/Spacer"
import { ActionFormProvider } from "providers/ActionFormProvider"
import { getPlayableOptions } from "providers/SquadProvider"
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

const useContenders = (combatId: string, squadId: string) => {
  const { data: members } = useSquadMembers(squadId)
  const { data: contenders = [] } = useQuery({
    ...getCombatOptions(combatId),
    select: combat => combat.contendersIds
  })
  const subPlayables = useMemo(() => {
    const contendersSet = new Set(contenders)
    const membersSet = new Set(Object.keys(members))
    return Array.from(contendersSet.difference(membersSet))
  }, [contenders, members])
  return subPlayables
}

function Loader({
  squadId,
  combatId,
  children
}: {
  squadId: string
  combatId: string
  children: ReactNode
}) {
  const playablesIds = useContenders(combatId, squadId)
  const isContendersPending = useQueries({
    queries: playablesIds.flatMap(id => getPlayableOptions(id)),
    combine: r => r.some(q => q.isPending)
  })
  const combatQuery = useQuery(getCombatOptions(combatId))
  const isCombatPending = combatQuery.isEnabled && combatQuery.isPending
  if (isContendersPending || isCombatPending) return <LoadingScreen />
  return children
}

function SubContenders({ squadId, combatId }: { squadId: string; combatId: string }) {
  const playablesIds = useContenders(combatId, squadId)
  return <SubPlayables playablesIds={playablesIds} squadId={squadId} />
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
      <SubContenders squadId={squadId} combatId={combatId} />
      <Loader squadId={squadId} combatId={combatId}>
        <ActionFormProvider combatId={combatId}>{children}</ActionFormProvider>
      </Loader>
    </>
  )
}

export default function CombatLayout() {
  const { charId, squadId } = useLocalSearchParams<{ charId: string; squadId: string }>()
  const { data: isGameMaster } = useCharInfo(charId, info => info.isNpc)
  const { data: combatId } = useCombatStatus(charId, data => data.combatId)
  const isInCombat = combatId !== ""
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
