import { View } from "react-native"

import { Tabs, useLocalSearchParams } from "expo-router"

import SubPlayables from "lib/character/use-cases/sub-playables"
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
  const { squadId } = useLocalSearchParams<{ squadId: string }>()
  const squad = useSquad(squadId, state => ({
    members: state.members,
    npcs: state.npcs,
    datetime: state.datetime
  }))
  const playablesIds = Object.keys({ ...squad.data.members, ...squad.data.npcs })
  return (
    <SubPlayables playablesIds={playablesIds} datetime={squad.data.datetime}>
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
    </SubPlayables>
  )
}
