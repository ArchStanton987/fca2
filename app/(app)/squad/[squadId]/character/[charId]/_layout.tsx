import { useLocalSearchParams } from "expo-router"
import { Drawer } from "expo-router/drawer"

import CustomDrawer from "components/Drawer/Drawer"
import { DrawerParams } from "components/Drawer/Drawer.params"
import styles from "components/Drawer/Drawer.styles"
import BaseAttrProvider from "providers/BaseAttrProvider"
import CurrAttrProvider from "providers/CurrAttrProvider"
import { SearchParams } from "screens/ScreenParams"

export default function CharLayout() {
  const { charId, squadId } = useLocalSearchParams() as SearchParams<DrawerParams>
  return (
    <BaseAttrProvider charId={charId}>
      <CurrAttrProvider charId={charId}>
        <Drawer
          defaultStatus="open"
          screenOptions={{
            headerShown: false,
            drawerType: "permanent",
            drawerStyle: styles.drawerContainer,
            drawerPosition: "right"
          }}
          // eslint-disable-next-line react/no-unstable-nested-components
          drawerContent={props => <CustomDrawer charId={charId} squadId={squadId} {...props} />}
        >
          <Drawer.Screen name="main" options={{ title: "Perso" }} />
          <Drawer.Screen name="inventory" options={{ title: "Inventaire" }} />
          <Drawer.Screen name="combat" options={{ title: "Combat" }} />
        </Drawer>
      </CurrAttrProvider>
    </BaseAttrProvider>
  )
}
