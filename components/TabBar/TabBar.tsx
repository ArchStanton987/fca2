import { TouchableHighlight, TouchableOpacity, View } from "react-native"

import { useLocalSearchParams, useRouter } from "expo-router"

import { BottomTabBarProps } from "@react-navigation/bottom-tabs"

import { DrawerParams } from "components/Drawer/Drawer.params"
import List from "components/List"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import { adminRoute, charRoute } from "constants/routes"
import { SearchParams } from "screens/ScreenParams"
import layout from "styles/layout"

import styles from "./TabBar.styles"

type TabBarId = "char" | "admin"

export default function TabBar(props: BottomTabBarProps & { tabBarId: TabBarId }) {
  const { state, descriptors, tabBarId } = props
  const { routes } = state
  const router = useRouter()
  const localParams = useLocalSearchParams() as SearchParams<DrawerParams>
  const { charId, squadId } = localParams

  const onPressTab = (routeName: string) => {
    if (tabBarId === "char") {
      router.push({ pathname: `${charRoute}/${routeName}`, params: { charId, squadId } })
      return
    }
    router.push({ pathname: `${adminRoute}/${routeName}` })
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
            return (
              <TouchableHighlight
                key={key}
                style={[styles.tabBarItem, isFocused && styles.tabBarItemActive]}
                onPress={() => onPressTab(name)}
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
