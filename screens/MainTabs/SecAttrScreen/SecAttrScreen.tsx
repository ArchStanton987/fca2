import { memo } from "react"

import secAttrMap from "lib/character/abilities/sec-attr/sec-attr"

import DrawerPage from "components/DrawerPage"
import List from "components/List"
import ScrollSection from "components/Section/ScrollSection"
import { ComposedTitleProps } from "components/Section/Section.types"
import AttributeRow from "components/tables/Attributes/AttributeRow"
import { useCharacter } from "contexts/CharacterContext"

const secAttrArray = Object.values(secAttrMap)

const title: ComposedTitleProps = [
  { title: "attribut", containerStyle: { flex: 1 } },
  { title: "base", containerStyle: { width: 55 } },
  { title: "mod", containerStyle: { width: 55 } },
  { title: "tot", containerStyle: { width: 55 } }
]

function SecAttrScreen() {
  const { secAttr } = useCharacter()
  const { base, mod, curr } = secAttr

  return (
    <DrawerPage>
      <ScrollSection style={{ flex: 1 }} contentContainerStyle={{ paddingRight: 0 }} title={title}>
        <List
          data={secAttrArray}
          keyExtractor={item => item.id}
          style={{ flex: 1 }}
          renderItem={({ item }) => {
            const baseValue = base[item.id]
            const modValue = mod[item.id]
            const currValue = curr[item.id]
            return (
              <AttributeRow
                label={item.label}
                values={{ baseValue, modValue, currValue }}
                unit={item.unit}
                onPress={() => {}}
              />
            )
          }}
        />
      </ScrollSection>
    </DrawerPage>
  )
}

export default memo(SecAttrScreen)
