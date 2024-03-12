import React from "react"
import { ActivityIndicator, View } from "react-native"

import skillsMap from "lib/character/abilities/skills/skills"
import { FlatList } from "react-native-gesture-handler"

import Section from "components/Section"
import Txt from "components/Txt"
import { useCurrAttr } from "providers/CurrAttrProvider"
import colors from "styles/colors"

import styles from "./RecapScreen.styles"

const skillsArray = Object.values(skillsMap)

function ListHeader() {
  return (
    <View style={styles.skillHeader}>
      <Txt>COMPETENCE</Txt>
      <Txt>SCORE</Txt>
    </View>
  )
}

function EmptyComponent() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="small" color={colors.secColor} />
    </View>
  )
}

export default function SkillsSection() {
  const { currSkills } = useCurrAttr()
  return (
    <Section style={{ width: 160 }}>
      <FlatList
        data={skillsArray}
        keyExtractor={item => item.id}
        ListEmptyComponent={EmptyComponent}
        ListHeaderComponent={ListHeader}
        stickyHeaderIndices={[0]}
        renderItem={({ item }) => (
          <View style={styles.skillRow}>
            <Txt>{skillsMap[item.id].label}</Txt>
            <Txt>{currSkills ? currSkills[item.id] : "-"}</Txt>
          </View>
        )}
      />
    </Section>
  )
}
