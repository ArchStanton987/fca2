import { Tabs } from "expo-router/tabs"

import TabBar from "components/TabBar/TabBar"
// import styles from "components/TabBar/TabBar.styles"
import colors from "styles/colors"

export default function InventoryLayout() {
  return (
    <Tabs
      // eslint-disable-next-line react/no-unstable-nested-components
      tabBar={props => <TabBar tabBarId="inventory" {...props} />}
      screenOptions={{
        headerShown: false,
        // tabBarLabelPosition: "beside-icon",
        // tabBarLabelStyle: styles.label,
        // tabBarIcon: () => null,
        // tabBarBadge: 1,
        // tabBarBadgeStyle: styles.badge
        // tabBarActiveTintColor: colors.secColor,
        // tabBarInactiveTintColor: colors.terColor,
        // tabBarActiveBackgroundColor: colors.terColor,
        // tabBarInactiveBackgroundColor: colors.primColor,
        tabBarHideOnKeyboard: true
        // tabBarItemStyle: styles.tabBarItem,
        // tabBarStyle: styles.tabBar
      }}
      sceneContainerStyle={{
        backgroundColor: colors.primColor
      }}
    >
      <Tabs.Screen name="weapons" options={{ title: "Armes" }} />
      <Tabs.Screen name="clothings" options={{ title: "Armures" }} />
      <Tabs.Screen name="consumables" options={{ title: "Consommables" }} />
      <Tabs.Screen name="misc-objects" options={{ title: "Divers" }} />
      <Tabs.Screen name="ammo" options={{ title: "Munitions" }} />
    </Tabs>
  )
}
