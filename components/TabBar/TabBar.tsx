import React, { useContext } from "react"
import { TouchableHighlight, View } from "react-native"

import { useLocalSearchParams, useRouter } from "expo-router"

import { BottomTabBarProps } from "@react-navigation/bottom-tabs"

import { DrawerParams } from "components/Drawer/Drawer.params"
import Txt from "components/Txt"
import SmallLine from "components/draws/Line/Line"
import PlusIcon from "components/icons/PlusIcon"
import { charRoute } from "constants/routes"
import { CharacterContext } from "contexts/CharacterContext"
import { SearchParams } from "screens/ScreenParams"

import styles from "./TabBar.styles"

type TabBarId = "main" | "inventory" | "combat"
type TabBarProps = BottomTabBarProps & {
  tabBarId: TabBarId
}

export default function TabBar(props: TabBarProps) {
  const { state, descriptors, tabBarId } = props
  const { routes } = state
  const router = useRouter()
  const localParams = useLocalSearchParams() as SearchParams<DrawerParams>
  const { charId, squadId } = localParams

  const character = useContext(CharacterContext)
  const progress = character?.progress || { availableSkillPoints: 0, availableKnowledgePoints: 0 }
  const canAddSkill = progress.availableSkillPoints > 0
  const canAddKnowledge = progress.availableKnowledgePoints > 0

  const onPress = (pathname: string) => {
    requestAnimationFrame(() => {
      router.push({ pathname, params: { charId, squadId } })
    })
  }

  const onLongPress = (hasBadge: boolean, name: string) => {
    if (!hasBadge) return
    const path = `${charRoute}/update-${name}`
    requestAnimationFrame(() => {
      router.push({ pathname: path, params: { charId, squadId } })
    })
  }

  return (
    <View style={styles.container}>
      <SmallLine top left style={{ top: 4 }} />
      <SmallLine top right style={{ top: 4 }} />
      <View style={styles.horizLine} />
      {routes.map(({ key, name }, index) => {
        const { options } = descriptors[key]
        const isFocused = state.index === index
        const pathname = `${charRoute}/${tabBarId}/${name}`
        const hasBadge =
          (name === "skills" && canAddSkill) || (name === "knowledge" && canAddKnowledge)
        return (
          <TouchableHighlight
            key={key}
            style={[styles.tabBarItem, isFocused && styles.tabBarItemActive]}
            onPress={() => onPress(pathname)}
            onLongPress={() => onLongPress(hasBadge, name)}
          >
            <>
              {hasBadge && <PlusIcon style={styles.badge} size={12} />}
              <Txt style={styles.label}>{options.title}</Txt>
            </>
          </TouchableHighlight>
        )
      })}
    </View>
  )
}
