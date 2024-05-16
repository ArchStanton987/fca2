/* eslint-disable react/no-unstable-nested-components */
import { useLocalSearchParams } from "expo-router"
import { Tabs } from "expo-router/tabs"

import Header from "components/Header/Header"
import { HeaderElementId } from "components/Header/Header.utils"
import TabBar from "components/TabBar/TabBar"
import colors from "styles/colors"

const datetime: HeaderElementId[] = ["date", "time"]
const carry: HeaderElementId[] = ["weight", "place"]

export default function InventoryLayout() {
  const { squadId, charId } = useLocalSearchParams<{ squadId: string; charId: string }>()
  return (
    <Tabs
      // eslint-disable-next-line react/no-unstable-nested-components
      tabBar={props => <TabBar tabBarId="inventory" {...props} />}
      screenOptions={{
        tabBarHideOnKeyboard: true,
        header: props => (
          <Header headerElementsIds={[...datetime, "progression", ...carry, "caps"]} {...props} />
        ),
        headerStyle: {
          backgroundColor: colors.primColor,
          height: 40,
          borderBottomWidth: 0
        }
      }}
      sceneContainerStyle={{
        backgroundColor: colors.primColor
      }}
    >
      <Tabs.Screen
        name="weapons"
        options={{ title: "Armes" }}
        initialParams={{ squadId, charId }}
      />
      <Tabs.Screen name="clothings" options={{ title: "Armures" }} />
      <Tabs.Screen name="consumables" options={{ title: "Consommables" }} />
      <Tabs.Screen name="misc-objects" options={{ title: "Divers" }} />
      <Tabs.Screen name="ammo" options={{ title: "Munitions" }} />
    </Tabs>
  )
}
