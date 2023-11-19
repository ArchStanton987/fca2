import { TouchableOpacity } from "react-native"

import { useRouter } from "expo-router/src/hooks"

import { DrawerContentComponentProps, DrawerContentScrollView } from "@react-navigation/drawer"

import Spacer from "components/Spacer"
import Txt from "components/Txt"
import SmallLine from "components/draws/Line/Line"
import WithItemSeparator from "components/wrappers/WithItemSeparator"

import styles from "./Drawer.styles"

type CustomDrawerProps = DrawerContentComponentProps & {
  charId: string
}

export default function CustomDrawer(props: CustomDrawerProps) {
  const { state, descriptors, charId } = props
  const { routes } = state
  const router = useRouter()

  const toHome = () => router.push("/")

  return (
    <DrawerContentScrollView scrollEnabled={false} {...props}>
      <SmallLine top left />

      <Spacer y={16} />
      <TouchableOpacity onPress={toHome} style={styles.fcaContainer}>
        <Txt style={styles.fca}>{"<FCA>"}</Txt>
      </TouchableOpacity>
      <Spacer y={30} />

      <WithItemSeparator ItemSeparatorComponent={<Spacer y={16} />}>
        {routes.map((route, index) => {
          const { title } = descriptors[route.key].options
          const isFocused = state.index === index
          const pathname = `/character/[charId]/${route.name}`
          const onPress = () => router.push({ pathname, params: { charId } })
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
