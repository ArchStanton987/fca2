import { StyleSheet, View } from "react-native"

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
  return <TabBar tabBarId="admin" {...props} />
}

const styles = StyleSheet.create({
  headerStyle: {
    backgroundColor: colors.primColor,
    height: 40,
    borderBottomWidth: 0
  },
  sceneStyle: {
    backgroundColor: colors.primColor
  }
})

export default function Layout() {
  const { squadId } = useLocalSearchParams<{ squadId: string }>()
  const { data: playablesIds } = useSquad(squadId, squad => [
    ...Object.values(squad.members),
    ...Object.values(squad.npcs)
  ])
  return (
    <>
      <SubPlayables playablesIds={playablesIds} squadId={squadId} />
      <View style={{ padding: 10, flex: 1 }}>
        <Tabs
          tabBar={TabBarComponent}
          screenOptions={{
            tabBarHideOnKeyboard: true,
            header: HeaderDatetime,
            headerStyle: styles.headerStyle,
            sceneStyle: styles.sceneStyle
          }}
        >
          <Tabs.Screen name="datetime" options={{ title: "Horloge" }} />
          <Tabs.Screen name="combats" options={{ title: "Combats" }} />
          <Tabs.Screen name="npc" options={{ title: "PNJs" }} />
          <Tabs.Screen name="creation" options={{ title: "Creation" }} />
        </Tabs>
      </View>
    </>
  )
}
