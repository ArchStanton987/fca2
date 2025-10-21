import React, { useState } from "react"

import { useLocalSearchParams } from "expo-router"

import { useSpecial } from "lib/character/abilities/abilities-provider"
import specialMap, { specialArray } from "lib/character/abilities/special/special"
import { SpecialId } from "lib/character/abilities/special/special.types"

import DrawerPage from "components/DrawerPage"
import List from "components/List"
import ScrollSection from "components/Section/ScrollSection"
import { ComposedTitleProps } from "components/Section/Section.types"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import AttributeRow from "components/tables/Attributes/AttributeRow"
import layout from "styles/layout"

const title: ComposedTitleProps = [
  { title: "attribut", containerStyle: { flex: 1 } },
  { title: "base", containerStyle: { width: 55 } },
  { title: "mod", containerStyle: { width: 55 } },
  { title: "tot", containerStyle: { width: 55 } }
]

export default function SpecialScreen() {
  const { charId } = useLocalSearchParams<{ charId: string }>()
  const [selectedId, setSelectedId] = useState<SpecialId | null>(null)

  const { data: special } = useSpecial(charId)
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
