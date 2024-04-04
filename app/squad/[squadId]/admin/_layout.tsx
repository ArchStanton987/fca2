import { useMemo } from "react"

import { Tabs } from "expo-router"

import Header from "components/Header/Header"
import TabBar from "components/TabBar/TabBar"
import { AdminContext } from "contexts/AdminContext"
import { useSquad } from "contexts/SquadContext"
import useGetSquadCharacters from "hooks/db/useGetSquadCharacters"
import LoadingScreen from "screens/LoadingScreen"
import colors from "styles/colors"

export default function AdminLayout() {
  const squad = useSquad()
  const squadMembersIds = squad.members.map(member => member.id)
  const characters = useGetSquadCharacters(squadMembersIds, squad.date)

  const context = useMemo(() => {
    if (!characters) return null
    return { characters }
  }, [characters])

  if (!context) return <LoadingScreen />

  return (
    <AdminContext.Provider value={context}>
      <Tabs
        // eslint-disable-next-line react/no-unstable-nested-components
        tabBar={props => <TabBar tabBarId="main" {...props} />}
        screenOptions={{
          tabBarHideOnKeyboard: true,
          // eslint-disable-next-line react/no-unstable-nested-components
          header: props => (
            <Header headerElementsIds={["date", "time", "squadName", "home"]} {...props} />
          ),
          headerStyle: {
            backgroundColor: colors.primColor,
            height: 40,
            borderBottomWidth: 0
          }
        }}
        sceneContainerStyle={{ backgroundColor: colors.primColor, padding: 10 }}
      >
        <Tabs.Screen name="datetime" options={{ title: "Horloge" }} />
      </Tabs>
    </AdminContext.Provider>
  )
}
