import React, { useState } from "react"
import { FlatList } from "react-native"

import effectsMap from "lib/character/effects/effects"
import { EffectId } from "lib/character/effects/effects.types"

import DrawerPage from "components/DrawerPage"
import Section from "components/Section"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import { useCharacter } from "contexts/CharacterContext"
import EffectRow, { EffectHeader } from "screens/MainTabs/EffectsScreen/EffectRow"

export default function EffectsScreen() {
  const [selectedId, setSelectedId] = useState<EffectId | null>(null)

  const { effects } = useCharacter()

  return (
    <DrawerPage>
      <Section style={{ flex: 1 }}>
        <FlatList
          data={effects}
          keyExtractor={item => item.dbKey || item.id}
          ListHeaderComponent={EffectHeader}
          renderItem={({ item }) => {
            const isSelected = item.id === selectedId
            return (
              <EffectRow
                isSelected={isSelected}
                effect={item}
                onPress={() => setSelectedId(item.id)}
              />
            )
          }}
        />
      </Section>
      <Spacer x={10} />
      <Section style={{ width: 200 }}>
        <Txt>DESCRIPTION</Txt>
        <Spacer y={10} />
        <Txt>{selectedId && effectsMap[selectedId].description}</Txt>
      </Section>
    </DrawerPage>
  )
}
