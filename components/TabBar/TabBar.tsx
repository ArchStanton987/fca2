import { TouchableHighlight, TouchableOpacity, View } from "react-native"

import { useLocalSearchParams, useRouter } from "expo-router"

import { BottomTabBarProps } from "@react-navigation/bottom-tabs"
import { useCharInfo } from "lib/character/info/info-provider"

import List from "components/List"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import layout from "styles/layout"

import styles from "./TabBar.styles"

type TabBarId = "char" | "admin"

export default function TabBar(props: BottomTabBarProps & { tabBarId: TabBarId }) {
  const { state, descriptors, tabBarId } = props
  const { routes } = state
  const router = useRouter()
  const { charId, squadId } = useLocalSearchParams<{ charId: string; squadId: string }>()
  const { data: isNpc } = useCharInfo(charId, info => info.isNpc)

  const onPressTab = (routeName: string) => {
    const isAdmin = tabBarId === "admin"
    const pathname = isAdmin
      ? `/squad/[squadId]/admin/${routeName}`
      : `/squad/[squadId]/character/[charId]/${routeName}`
    // @ts-ignore
    router.push({ pathname, params: { squadId, charId } })
  }

  const toHome = () => {
    if (!isNpc) return router.push("/")
    return router.push({ pathname: "/squad/[squadId]/admin/datetime", params: { squadId } })
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toHome} style={styles.fcaContainer}>
        <Txt style={styles.fca}>{"<FCA>"}</Txt>
      </TouchableOpacity>
      <Spacer x={layout.globalPadding} />
      <View style={styles.subContainer}>
        <List
          data={routes as { key: string; name: string }[]}
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
