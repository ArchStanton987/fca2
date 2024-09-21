import React, { useContext } from "react"
import { TouchableHighlight, View } from "react-native"

import { BottomTabBarProps } from "@react-navigation/bottom-tabs"

import Txt from "components/Txt"
import SmallLine from "components/draws/Line/Line"
import PlusIcon from "components/icons/PlusIcon"
import { CharacterContext } from "contexts/CharacterContext"
import { useSquad } from "contexts/SquadContext"

import styles from "./TabBar.styles"

type TabBarId = "main" | "inventory" | "combat" | "admin"
type TabBarProps = BottomTabBarProps & {
  tabBarId: TabBarId
}

export default function TabBar({ state, descriptors, tabBarId, navigation }: TabBarProps) {
  const { squadId } = useSquad()
  //  we are not using dedicated hook on purpose, context might be called outside of a provider (admin)
  const character = useContext(CharacterContext)
  const charId = character?.charId
  const { routes } = state

  const progress = character?.progress || { availableSkillPoints: 0, availableKnowledgePoints: 0 }
  const canAddSkill = progress?.availableSkillPoints > 0
  const canAddKnowledge = progress.availableKnowledgePoints > 0
  return (
    <View style={styles.container}>
      <SmallLine top left style={{ top: 4 }} />
      <SmallLine top right style={{ top: 4 }} />
      <View style={styles.horizLine} />
      {routes.map(({ key, name }, index) => {
        const { options } = descriptors[key]
        const isFocused = state.index === index
        const hasBadge =
          (name === "skills" && canAddSkill) || (name === "knowledge" && canAddKnowledge)
        return (
          <TouchableHighlight
            key={key}
            style={[styles.tabBarItem, isFocused && styles.tabBarItemActive]}
            onPress={() => navigation.navigate(name, { charId, squadId })}
            onLongPress={() => {
              if (!hasBadge) return
              const path = name === "knowledge" ? "UpdateKnowledges" : "UpdateSkills"
              navigation.navigate(path, { charId, squadId })
            }}
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
