import { useLocalSearchParams } from "expo-router"
import { Tabs } from "expo-router/tabs"

import Header from "components/Header/Header"
import { HeaderElementId } from "components/Header/Header.utils"
import TabBar from "components/TabBar/TabBar"
import colors from "styles/colors"

const special: HeaderElementId[] = [
  "strength",
  "perception",
  "endurance",
  "charisma",
  "intelligence",
  "agility",
  "luck"
]
const datetime: HeaderElementId[] = ["date", "time"]
const headerElementsIds: HeaderElementId[] = [...datetime, "progression", ...special, "rads", "hp"]

export default function CharLayout() {
  const { squadId, charId } = useLocalSearchParams<{ squadId: string; charId: string }>()
  return (
    <Tabs
      tabBar={props => <TabBar tabBarId="main" {...props} />}
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
      <Tabs.Screen name="recap" options={{ title: "Résumé" }} initialParams={{ squadId, charId }} />
      <Tabs.Screen name="effects" options={{ title: "Effets" }} />
      <Tabs.Screen name="special" options={{ title: "SPECIAL" }} />
      <Tabs.Screen name="sec-attr" options={{ title: "Attr. Sec." }} />
      <Tabs.Screen name="skills" options={{ title: "Compétences" }} />
      <Tabs.Screen name="knowledges" options={{ title: "Connaissances" }} />
      <Tabs.Screen name="perks" options={{ title: "Traits" }} />
    </Tabs>
  )
}
