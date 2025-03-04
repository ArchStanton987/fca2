import { useMemo } from "react"
import { View } from "react-native"

import { Tabs } from "expo-router"

import Header from "components/Header/Header"
import { HeaderElementId } from "components/Header/Header.utils"
import TabBar from "components/TabBar/TabBar"
import { AdminContext } from "contexts/AdminContext"
import { useSquad } from "contexts/SquadContext"
import useCreatedElements from "hooks/context/useCreatedElements"
import useGetSquadCharacters from "hooks/db/useGetSquadCharacters"
import LoadingScreen from "screens/LoadingScreen"
import colors from "styles/colors"

const headerElementsIds: HeaderElementId[] = ["date", "time", "squadName", "home"]

function HeaderDatetime() {
  return <Header headerElementsIds={headerElementsIds} />
}

function TabBarComponent(props: any) {
  return <TabBar tabbarLabel="Admin" {...props} />
}

export default function AdminLayout() {
  const createdElements = useCreatedElements()
  const squad = useSquad()
  const { members } = squad
  // TODO: fix useGetSquadCharacters loop when dependencies are registered, insure stable ref of params
  const squadMembersIds = useMemo(() => members.map(member => member.id), [members])
  const currSquad = useMemo(() => squad, [squad])
  const characters = useGetSquadCharacters(squadMembersIds || [], currSquad, createdElements)

  const context = useMemo(() => {
    if (!characters) return null
    return { characters }
  }, [characters])

  if (!context) return <LoadingScreen />

  return (
    <AdminContext.Provider value={context}>
      <View style={{ padding: 10, flex: 1 }}>
        <Tabs
          tabBar={TabBarComponent}
          screenOptions={{
            tabBarHideOnKeyboard: true,
            header: HeaderDatetime,
            headerStyle: { backgroundColor: colors.primColor, borderBottomWidth: 0 },
            sceneStyle: { backgroundColor: colors.primColor }
          }}
        >
          <Tabs.Screen name="datetime" options={{ title: "Horloge" }} />
          <Tabs.Screen name="creation" options={{ title: "Creation" }} />
        </Tabs>
      </View>
    </AdminContext.Provider>
  )
}
