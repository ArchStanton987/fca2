import React from "react"
import { TouchableHighlight, View } from "react-native"

import { useLocalSearchParams, useRouter } from "expo-router"

import { BottomTabBarProps } from "@react-navigation/bottom-tabs"

import { DrawerParams } from "components/Drawer/Drawer.params"
import Txt from "components/Txt"
import SmallLine from "components/draws/Line/Line"
import { charRoute } from "constants/routes"
import { SearchParams } from "screens/ScreenParams"

import styles from "./TabBar.styles"

type TabBarId = "main" | "inventory"
type TabBarProps = BottomTabBarProps & {
  tabBarId: TabBarId
}

export default function TabBar(props: TabBarProps) {
  const { state, descriptors, tabBarId } = props
  const { routes } = state
  const router = useRouter()
  const localParams = useLocalSearchParams() as SearchParams<DrawerParams>
  const { charId, squadId } = localParams
  return (
    <View style={styles.container}>
      <SmallLine top left style={{ top: 4 }} />
      <SmallLine top right style={{ top: 4 }} />
      <View style={styles.horizLine} />
      {routes.map((route, index) => {
        const { options } = descriptors[route.key]
        const isFocused = state.index === index
        const pathname = `${charRoute}/${tabBarId}/${route.name}`
        return (
          <TouchableHighlight
            key={route.key}
            style={[styles.tabBarItem, isFocused && styles.tabBarItemActive]}
            onPress={() => router.push({ pathname, params: { charId, squadId } })}
          >
            <Txt style={styles.label}>{options.title}</Txt>
          </TouchableHighlight>
        )
      })}
    </View>
  )
}
