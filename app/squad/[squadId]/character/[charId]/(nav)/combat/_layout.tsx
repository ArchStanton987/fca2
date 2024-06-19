import { Tabs, useLocalSearchParams } from "expo-router"

import Header from "components/Header/Header"
import { HeaderElementId } from "components/Header/Header.utils"
import TabBar from "components/TabBar/TabBar"
import colors from "styles/colors"

const datetime: HeaderElementId[] = ["date", "time"]

export default function CombatLayout() {
  const { squadId, charId } = useLocalSearchParams<{ squadId: string; charId: string }>()
  return (
    <Tabs
      // eslint-disable-next-line react/no-unstable-nested-components
      tabBar={props => <TabBar tabBarId="main" {...props} />}
      screenOptions={{
        headerShown: false,
        // eslint-disable-next-line react/no-unstable-nested-components
        header: props => (
          <Header headerElementsIds={[...datetime, "progression", "rads", "hp"]} {...props} />
        )
      }}
      sceneContainerStyle={{ backgroundColor: colors.primColor }}
    >
      <Tabs.Screen
        name="combat"
        options={{ title: "Bagarre" }}
        initialParams={{ squadId, charId }}
      />
    </Tabs>
  )
}
