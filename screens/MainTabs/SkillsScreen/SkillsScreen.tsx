import React from "react"
import { FlatList } from "react-native"

import skillsMap from "lib/character/abilities/skills/skills"

// import { observer } from "mobx-react-lite"
import DrawerPage from "components/DrawerPage"
import Section from "components/Section"
import AttributeRow, { SkillsHeader } from "components/tables/Attributes/AttributeRow"
import { useBaseAttr } from "providers/BaseAttrProvider"
// import { useCharacter } from "providers/CharDataProvider"
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
          ListHeaderComponent={SkillsHeader}
          stickyHeaderIndices={[0]}
          renderItem={({ item }) => {
            const { label } = skillsMap[item.id]
            const baseValue = baseContext.baseSkills[item.id]
            const upValue = baseContext.upSkills[item.id]
            const modValue = currContext.modSkills[item.id]
            const currValue = currContext.currSkills[item.id]
            const values = { baseValue, upValue, modValue, currValue }
            return <AttributeRow label={label} values={values} />
          }}
        />
      </Section>
    </DrawerPage>
  )
}

// export default observer(SkillsScreen)
