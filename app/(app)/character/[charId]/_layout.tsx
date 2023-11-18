import { useLocalSearchParams } from "expo-router"
import { Drawer } from "expo-router/drawer"

import CustomDrawer from "components/Drawer/Drawer"
import { DrawerParams } from "components/Drawer/Drawer.params"
import styles from "components/Drawer/Drawer.styles"
import { SearchParams } from "screens/ScreenParams"
import colors from "styles/colors"

export default function CharLayout() {
  const { charId } = useLocalSearchParams() as SearchParams<DrawerParams>
  return (
    <Drawer
      defaultStatus="open"
      screenOptions={{
        headerShown: false,
        drawerType: "permanent",
        drawerActiveBackgroundColor: colors.terColor,
        drawerInactiveBackgroundColor: colors.primColor,
        drawerStyle: styles.drawerContainer,
        drawerItemStyle: styles.navButton,
        drawerLabelStyle: styles.navButtonText
      }}
      // eslint-disable-next-line react/no-unstable-nested-components
      drawerContent={props => <CustomDrawer charId={charId} {...props} />}
    >
      <Drawer.Screen name="main" options={{ title: "Perso" }} />
      <Drawer.Screen name="inventory" options={{ title: "Inventaire" }} />
      <Drawer.Screen name="combat" options={{ title: "Combat" }} />
    </Drawer>
  )
}
