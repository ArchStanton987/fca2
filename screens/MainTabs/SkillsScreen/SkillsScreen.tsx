import React from "react"
import { FlatList } from "react-native"

import DrawerPage from "components/DrawerPage"
import Section from "components/Section"
import AttributeRow, { AttributeHeader } from "components/tables/Attributes/AttributeRow"
import skillsMap from "models/character/skills/skills"
import { useBaseAttr } from "providers/BaseAttrProvider"
import { useCurrAttr } from "providers/CurrAttrProvider"
import LoadingScreen from "screens/LoadingScreen"

const skillsArray = Object.values(skillsMap)

export default function SkillsScreen() {
  const baseContext = useBaseAttr()
  const currContext = useCurrAttr()

  if (!baseContext.isReady || !currContext.isReady) return <LoadingScreen />
  return (
    <DrawerPage>
      <Section style={{ flex: 1 }}>
        <FlatList
          data={skillsArray}
          keyExtractor={item => item.id}
          ListHeaderComponent={AttributeHeader}
          stickyHeaderIndices={[0]}
          renderItem={({ item }) => {
            const { label } = skillsMap[item.id]
            const baseValue = baseContext.baseSkills[item.id]
            const modValue = currContext.modSkills[item.id]
            const currValue = currContext.currSkills[item.id]
            return <AttributeRow label={label} values={{ baseValue, modValue, currValue }} />
          }}
        />
      </Section>
    </DrawerPage>
  )
}
