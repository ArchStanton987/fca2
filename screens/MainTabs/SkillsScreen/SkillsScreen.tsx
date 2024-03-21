import React from "react"
import { FlatList } from "react-native"

import skillsMap from "lib/character/abilities/skills/skills"

import DrawerPage from "components/DrawerPage"
import Section from "components/Section"
import AttributeRow, { SkillsHeader } from "components/tables/Attributes/AttributeRow"
import { useCharacter } from "contexts/CharacterContext"

const skillsArray = Object.values(skillsMap)

export default function SkillsScreen() {
  const { skills } = useCharacter()
  const { base, up, mod, curr } = skills

  return (
    <DrawerPage>
      <Section style={{ flex: 1 }}>
        <FlatList
          data={skillsArray}
          keyExtractor={item => item.id}
          ListHeaderComponent={SkillsHeader}
          stickyHeaderIndices={[0]}
          renderItem={({ item }) => {
            const baseValue = base[item.id]
            const upValue = up[item.id]
            const modValue = mod[item.id]
            const currValue = curr[item.id]
            const values = { baseValue, upValue, modValue, currValue }
            return <AttributeRow label={item.label} values={values} />
          }}
        />
      </Section>
    </DrawerPage>
  )
}
