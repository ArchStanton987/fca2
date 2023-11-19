import { Tabs } from "expo-router/tabs"

import TabBar from "components/TabBar/TabBar"
import colors from "styles/colors"

export default function CharLayout() {
  return (
    <Tabs
      // eslint-disable-next-line react/no-unstable-nested-components
      tabBar={props => <TabBar tabBarId="main" {...props} />}
      screenOptions={{ headerShown: false, tabBarHideOnKeyboard: true }}
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
