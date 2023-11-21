/* eslint-disable react/no-unstable-nested-components */
import { Tabs } from "expo-router/tabs"

import Header from "components/Header/Header"
import { HeaderElementId } from "components/Header/Header.utils"
import TabBar from "components/TabBar/TabBar"
import colors from "styles/colors"

const headerElements = [
  "date",
  "time",
  "strength",
  "perception",
  "endurance",
  "charisma",
  "intelligence",
  "agility",
  "luck"
] as HeaderElementId[]

export default function CharLayout() {
  return (
    <Tabs
      // eslint-disable-next-line react/no-unstable-nested-components
      tabBar={props => <TabBar tabBarId="main" {...props} />}
      screenOptions={{
        header: props => <Header headerElementsIds={headerElements} {...props} />,
        headerStyle: {
          backgroundColor: colors.primColor,
          height: 40,
          borderBottomWidth: 0
        }
        tabBarHideOnKeyboard: true,
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
