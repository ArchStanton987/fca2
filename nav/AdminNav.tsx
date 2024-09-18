import React, { useMemo } from "react"

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import Squad from "lib/character/Squad"
import useCases from "lib/common/use-cases"
import { AdminBottomTabParamList, RootStackScreenProps } from "nav/nav.types"

import TabBar from "components/TabBar/TabBar"
import { AdminContext } from "contexts/AdminContext"
import { SquadContext, useSquad } from "contexts/SquadContext"
import useGetSquadCharacters from "hooks/db/useGetSquadCharacters"
import useRtdbSub from "hooks/db/useRtdbSub"
import DatetimeSelectionScreen from "screens/AdminTabs/DatetimeSelectionScreen/DatetimeSelectionScreen"
import LoadingScreen from "screens/LoadingScreen"

const Tab = createBottomTabNavigator<AdminBottomTabParamList>()

function AdminContextProvider({ children }: { children: React.ReactNode }) {
  const { date, members } = useSquad()
  // TODO: fix useGetSquadCharacters loop when dependencies are registered, insure stable ref of params
  const squadMembersIds = useMemo(() => members.map(member => member.id), [members])
  const jsonDate = date.toJSON()
  const squadDate = useMemo(() => jsonDate, [jsonDate])
  const characters = useGetSquadCharacters(squadMembersIds || [], squadDate)

  const context = useMemo(() => {
    if (!characters) return null
    return { characters }
  }, [characters])

  if (!context) return <LoadingScreen />

  return <AdminContext.Provider value={context}>{children}</AdminContext.Provider>
}

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
      <AdminContextProvider>
        <Tab.Navigator
          initialRouteName="dateHeure"
          screenOptions={{ headerShown: false }}
          tabBar={props => <TabBar tabBarId="admin" {...props} />}
        >
          <Tab.Screen name="dateHeure" component={DatetimeSelectionScreen} />
        </Tab.Navigator>
      </AdminContextProvider>
    </SquadContext.Provider>
  )
}
