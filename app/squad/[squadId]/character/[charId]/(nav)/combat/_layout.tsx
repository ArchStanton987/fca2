import { Tabs, useLocalSearchParams } from "expo-router"

import Header from "components/Header/Header"
import { HeaderElementId } from "components/Header/Header.utils"
import TabBar from "components/TabBar/TabBar"
import colors from "styles/colors"

const headerElementsIds: HeaderElementId[] = [
  "date",
  "time",
  "armorClass",
  "critChance",
  "meleeDamage",
  "range",
  "progression",
  "rads",
  "hp"
]

export default function CombatLayout() {
  const { squadId, charId } = useLocalSearchParams<{ squadId: string; charId: string }>()
  return (
    <Tabs
      tabBar={props => <TabBar tabBarId="combat" {...props} />}
      screenOptions={{
        tabBarHideOnKeyboard: true,
        header: () => <Header headerElementsIds={headerElementsIds} />,
        headerStyle: {
          backgroundColor: colors.primColor,
          height: 40,
          borderBottomWidth: 0
        },
        sceneStyle: { backgroundColor: colors.primColor }
      }}
    >
      <Tabs.Screen
        name="recap"
        options={{ title: "Bagarre" }}
        initialParams={{ squadId, charId }}
      />
    </Tabs>
  )
}
