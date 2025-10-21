import React from "react"
import { ActivityIndicator, StyleSheet, View } from "react-native"

import { useCurrSkills } from "lib/character/abilities/abilities-provider"
import skillsMap from "lib/character/abilities/skills/skills"

import List from "components/List"
import ScrollSection from "components/Section/ScrollSection"
import Txt from "components/Txt"
import colors from "styles/colors"

const skillsArray = Object.values(skillsMap)

const styles = StyleSheet.create({
  skillRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5
  }
})

function EmptyComponent() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="small" color={colors.secColor} />
    </View>
  )
}

export default function SkillsSection({ charId }: { charId: string }) {
  const { data: currSkills } = useCurrSkills(charId)
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
