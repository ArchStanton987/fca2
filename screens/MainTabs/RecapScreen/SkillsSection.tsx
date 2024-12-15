import React from "react"
import { ActivityIndicator, View } from "react-native"

import skillsMap from "lib/character/abilities/skills/skills"

import List from "components/List"
import ScrollSection from "components/Section/ScrollSection"
import Txt from "components/Txt"
import { useCharacter } from "contexts/CharacterContext"
import colors from "styles/colors"

import styles from "./RecapScreen.styles"

const skillsArray = Object.values(skillsMap)

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
  return (
    <ScrollSection style={{ width: 160 }} title="compétences">
      <List
        data={skillsArray}
        keyExtractor={item => item.id}
        ListEmptyComponent={EmptyComponent}
        renderItem={({ item }) => (
          <View style={styles.skillRow}>
            <Txt>{skillsMap[item.id].label}</Txt>
            <Txt>{currSkills ? currSkills[item.id] : "-"}</Txt>
          </View>
        )}
      />
    </ScrollSection>
  )
}
