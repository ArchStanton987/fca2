import { Tabs } from "expo-router"

import Header from "components/Header/Header"
import TabBar from "components/TabBar/TabBar"
import colors from "styles/colors"

export default function AdminLayout() {
  return (
    <Tabs
      // eslint-disable-next-line react/no-unstable-nested-components
      tabBar={props => <TabBar tabBarId="main" {...props} />}
      screenOptions={{
        tabBarHideOnKeyboard: true,
        // eslint-disable-next-line react/no-unstable-nested-components
        header: props => (
          <Header headerElementsIds={["date", "time", "squadName", "home"]} {...props} />
        ),
        headerStyle: {
          backgroundColor: colors.primColor,
          height: 40,
          borderBottomWidth: 0
        }
      }}
      sceneContainerStyle={{ backgroundColor: colors.primColor, padding: 10 }}
    >
      <Tabs.Screen name="datetime" options={{ title: "Horloge" }} />
    </Tabs>
  )
}
