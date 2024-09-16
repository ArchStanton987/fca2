import React, { useMemo } from "react"

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import Squad from "lib/character/Squad"
import useCases from "lib/common/use-cases"
import { AdminBottomTabParamList, RootStackScreenProps } from "nav/nav.types"

import TabBar from "components/TabBar/TabBar"
import { SquadContext } from "contexts/SquadContext"
import useRtdbSub from "hooks/db/useRtdbSub"
import DatetimeSelectionScreen from "screens/AdminTabs/DatetimeSelectionScreen/DatetimeSelectionScreen"
import LoadingScreen from "screens/LoadingScreen"

const Tab = createBottomTabNavigator<AdminBottomTabParamList>()

export default function AdminNav(props: RootStackScreenProps<"Admin">) {
  const { squadId } = props.route.params
  const dbSquad = useRtdbSub(useCases.squad.get(squadId))

  const squad = useMemo(() => {
    if (!dbSquad) return null
    return new Squad(dbSquad, squadId)
  }, [dbSquad, squadId])

  if (!squad) return <LoadingScreen />

  return (
    <SquadContext.Provider value={squad}>
      <Tab.Navigator
        initialRouteName="dateHeure"
        screenOptions={{ headerShown: false }}
        tabBar={props => <TabBar tabBarId="combat" {...props} />}
      >
        <Tab.Screen name="dateHeure" component={DatetimeSelectionScreen} />
      </Tab.Navigator>
    </SquadContext.Provider>
  )
}
