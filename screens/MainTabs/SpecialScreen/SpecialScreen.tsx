import React, { memo, useState } from "react"

import specialMap, { specialArray } from "lib/character/abilities/special/special"
import { SpecialId } from "lib/character/abilities/special/special.types"

import DrawerPage from "components/DrawerPage"
import List from "components/List"
import ScrollSection from "components/Section/ScrollSection"
import { ComposedTitleProps } from "components/Section/Section.types"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import AttributeRow from "components/tables/Attributes/AttributeRow"
import { useCharacter } from "contexts/CharacterContext"
import layout from "styles/layout"

const title: ComposedTitleProps = [
  { title: "attribut", containerStyle: { flex: 1 } },
  { title: "base", containerStyle: { width: 55 } },
  { title: "mod", containerStyle: { width: 55 } },
  { title: "tot", containerStyle: { width: 55 } }
]

function SpecialScreen() {
  const [selectedId, setSelectedId] = useState<SpecialId | null>(null)

  const { special } = useCharacter()
  const { base, mod, curr } = special

  return (
    <DrawerPage>
      <ScrollSection style={{ flex: 1 }} contentContainerStyle={{ paddingRight: 0 }} title={title}>
        <List
          data={specialArray}
          keyExtractor={item => item.id}
          renderItem={({ item }) => {
            const baseValue = base[item.id]
            const modValue = mod[item.id]
            const currValue = curr[item.id]
            return (
              <AttributeRow
                label={item.label}
                values={{ baseValue, modValue, currValue }}
                isSelected={selectedId === item.id}
                onPress={() => setSelectedId(item.id)}
              />
            )
          }}
        />
      </ScrollSection>
      <Spacer x={layout.globalPadding} />
      <ScrollSection style={{ width: 200 }} title="description">
        {selectedId && <Txt>{specialMap[selectedId].description}</Txt>}
      </ScrollSection>
    </DrawerPage>
  )
}

export default memo(SpecialScreen)
