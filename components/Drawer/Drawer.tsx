import { TouchableOpacity } from "react-native"

import { router } from "expo-router"

import { DrawerContentComponentProps, DrawerContentScrollView } from "@react-navigation/drawer"

import Spacer from "components/Spacer"
import Txt from "components/Txt"
import SmallLine from "components/draws/Line/Line"
import WithItemSeparator from "components/wrappers/WithItemSeparator"
import { charRoute } from "constants/routes"

import styles from "./Drawer.styles"

type CustomDrawerProps = DrawerContentComponentProps & {
  charId: string
  squadId: string
}

export default function CustomDrawer(props: CustomDrawerProps) {
  const { state, descriptors, charId, squadId } = props
  const { routes } = state

  const toHome = () => router.push("/")

  return (
    <DrawerContentScrollView scrollEnabled={false} {...props}>
      <SmallLine top left />

      <TouchableOpacity onPress={toHome} style={styles.fcaContainer}>
        <Txt style={styles.fca}>{"<FCA>"}</Txt>
      </TouchableOpacity>
      <Spacer y={20} />

      <WithItemSeparator ItemSeparatorComponent={<Spacer y={16} />}>
        {routes.map((route, index) => {
          const { title } = descriptors[route.key].options
          const isFocused = state.index === index
          const pathname = `${charRoute}/${route.name}`
          const onPress = () => router.push({ pathname, params: { charId, squadId } })
          return (
            <TouchableOpacity
              key={route.key}
              style={[styles.navButton, isFocused && styles.navButtonActive]}
              onPress={onPress}
            >
              <Txt style={[styles.navButtonText, isFocused && styles.navButtonActiveText]}>
                {title}
              </Txt>
            </TouchableOpacity>
          )
        })}
      </WithItemSeparator>
    </DrawerContentScrollView>
  )
}
