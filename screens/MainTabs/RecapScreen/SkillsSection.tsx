import React from "react"
import { ActivityIndicator, FlatList, View } from "react-native"

import skillsMap from "lib/character/abilities/skills/skills"

import Section from "components/Section"
import Txt from "components/Txt"
import { useCharacter } from "contexts/CharacterContext"
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
  const character = useCharacter()
  const currSkills = character.skills.curr
  // TODO: check wheter clothings affect skills (helmet, etc.)
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
