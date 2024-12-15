import { TouchableHighlight, TouchableOpacity, View } from "react-native"

import { useLocalSearchParams, useRouter } from "expo-router"

import { BottomTabBarProps } from "@react-navigation/bottom-tabs"

import { DrawerParams } from "components/Drawer/Drawer.params"
import List from "components/List"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import { charRoute } from "constants/routes"
import { SearchParams } from "screens/ScreenParams"
import layout from "styles/layout"

import styles from "./TabBar.styles"

export default function TabBar(props: BottomTabBarProps) {
  const { state, descriptors } = props
  const { routes } = state
  const router = useRouter()
  const localParams = useLocalSearchParams() as SearchParams<DrawerParams>
  const { charId, squadId } = localParams

  const onPress = (pathname: string) => {
    requestAnimationFrame(() => {
      router.push({ pathname, params: { charId, squadId } })
    })
  }

  const toHome = () => router.push("/")

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toHome} style={styles.fcaContainer}>
        <Txt style={styles.fca}>{"<FCA>"}</Txt>
      </TouchableOpacity>
      <Spacer x={layout.globalPadding} />
      <View style={styles.subContainer}>
        <List
          data={routes}
          keyExtractor={item => item.key}
          separator={<View style={styles.horizLine} />}
          style={styles.listStyle}
          horizontal
          renderItem={({ item, index }) => {
            const { key, name } = item
            const { options } = descriptors[key]
            const isFocused = state.index === index
            const pathname = `${charRoute}/${name}`
            return (
              <TouchableHighlight
                key={key}
                style={[styles.tabBarItem, isFocused && styles.tabBarItemActive]}
                onPress={() => onPress(pathname)}
              >
                <Txt style={[styles.label, isFocused && styles.labelActive]}>{options.title}</Txt>
              </TouchableHighlight>
            )
          }}
        />
      </View>
    </View>
  )
}
