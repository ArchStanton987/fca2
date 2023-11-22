/* eslint-disable react/no-unstable-nested-components */
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

export default function CharLayout() {
  return (
    <Tabs
      // eslint-disable-next-line react/no-unstable-nested-components
      tabBar={props => <TabBar tabBarId="main" {...props} />}
      screenOptions={{
        tabBarHideOnKeyboard: true,
        header: props => (
          <Header headerElementsIds={[...datetime, "progression", ...special, "caps"]} {...props} />
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
      <Tabs.Screen name="recap" options={{ title: "Résumé" }} />
      <Tabs.Screen name="effects" options={{ title: "Effets" }} />
      <Tabs.Screen name="special" options={{ title: "SPECIAL" }} />
      <Tabs.Screen name="sec-attr" options={{ title: "Attr. Sec." }} />
      <Tabs.Screen name="skills" options={{ title: "Compétences" }} />
      <Tabs.Screen name="knowledges" options={{ title: "Connaissances" }} />
    </Tabs>
  )
}
