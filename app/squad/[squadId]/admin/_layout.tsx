import { View } from "react-native"

import { Tabs } from "expo-router"

import PlayablesProvider from "lib/character/playables-provider"
import { useSquad } from "lib/squad/use-cases/sub-squad"

import Header from "components/Header/Header"
import { HeaderElementId } from "components/Header/Header.utils"
import TabBar from "components/TabBar/TabBar"
import colors from "styles/colors"

const headerElementsIds: HeaderElementId[] = ["date", "time", "squadName", "home"]

function HeaderDatetime() {
  return <Header headerElementsIds={headerElementsIds} />
}

function TabBarComponent(props: any) {
  return <TabBar tabbarLabel="Admin" {...props} />
}

export default function AdminLayout() {
  const { members, npcs } = useSquad()
  const ids = Object.keys({ ...members, ...npcs })
  return (
    <PlayablesProvider ids={ids}>
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
          <Tabs.Screen name="combats" options={{ title: "Combats" }} />
          <Tabs.Screen name="npc" options={{ title: "PNJs" }} />
          <Tabs.Screen name="creation" options={{ title: "Creation" }} />
        </Tabs>
      </View>
    </PlayablesProvider>
  )
}
