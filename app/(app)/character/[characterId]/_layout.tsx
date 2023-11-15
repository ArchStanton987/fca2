import { useRouter } from "expo-router"
import { Drawer } from "expo-router/drawer"

import { DrawerContentComponentProps, DrawerContentScrollView } from "@react-navigation/drawer"

import Spacer from "components/Spacer"
import Txt from "components/Txt"
import RevertColorsPressable from "components/wrappers/RevertColorsPressable/RevertColorsPressable"
import WithItemSeparator from "components/wrappers/WithItemSeparator"
import colors from "styles/colors"
import typos from "styles/typos"

function CustomDrawer(props: DrawerContentComponentProps) {
  const { state, descriptors } = props
  const { routes } = state

  const router = useRouter()
  return (
    <DrawerContentScrollView
      style={{ backgroundColor: colors.primColor, flex: 1, marginTop: 50, marginBottom: 50 }}
    >
      <RevertColorsPressable onPress={() => router.push("/")}>
        <Txt style={{ fontFamily: typos.jukebox, fontSize: 35, textAlign: "center" }}>
          {"<"}FCA{">"}
        </Txt>
      </RevertColorsPressable>
      <Spacer y={20} />
      <WithItemSeparator ItemSeparatorComponent={<Spacer y={10} />}>
        {routes.map(route => {
          const { options } = descriptors[route.key]
          return (
            <RevertColorsPressable
              key={route.key}
              onPress={() => router.push(route.name)}
              style={{ flexDirection: "row", justifyContent: "center" }}
            >
              <Txt>{options.title}</Txt>
            </RevertColorsPressable>
          )
        })}
      </WithItemSeparator>
    </DrawerContentScrollView>
  )
}

export default function DrawerLayout() {
  return (
    <Drawer
      defaultStatus="open"
      // eslint-disable-next-line react/no-unstable-nested-components
      drawerContent={props => <CustomDrawer {...props} />}
      screenOptions={{
        headerShown: false,
        drawerType: "permanent",
        drawerPosition: "left",
        sceneContainerStyle: { backgroundColor: colors.primColor }
      }}
    >
      <Drawer.Screen name="main" options={{ title: "Perso" }} />
      <Drawer.Screen name="inventory" options={{ title: "Inventaire" }} />
      <Drawer.Screen name="combat" options={{ title: "Combat" }} />
    </Drawer>
  )
}
