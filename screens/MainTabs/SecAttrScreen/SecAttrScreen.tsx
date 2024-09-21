import { memo } from "react"
import { FlatList } from "react-native"

import secAttrMap from "lib/character/abilities/sec-attr/sec-attr"

import DrawerPage from "components/DrawerPage"
import Section from "components/Section"
import AttributeRow, { AttributeHeader } from "components/tables/Attributes/AttributeRow"
import { useCharacter } from "contexts/CharacterContext"

const secAttrArray = Object.values(secAttrMap)

function SecAttrScreen() {
  const { secAttr } = useCharacter()
  const { base, mod, curr } = secAttr

  return (
    <DrawerPage>
      <Section style={{ flex: 1 }}>
        <FlatList
          data={secAttrArray}
          keyExtractor={item => item.id}
          ListHeaderComponent={AttributeHeader}
          stickyHeaderIndices={[0]}
          renderItem={({ item }) => {
            const baseValue = base[item.id]
            const modValue = mod[item.id]
            const currValue = curr[item.id]
            return (
              <AttributeRow
                label={item.label}
                values={{ baseValue, modValue, currValue }}
                unit={item.unit}
              />
            )
          }}
        />
      </Section>
    </DrawerPage>
  )
}

export default memo(SecAttrScreen)
