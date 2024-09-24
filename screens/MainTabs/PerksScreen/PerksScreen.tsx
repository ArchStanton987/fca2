import React, { memo, useState } from "react"
import { FlatList, ScrollView, TouchableOpacity, View, ViewBase } from "react-native"

import { Perk } from "lib/character/abilities/perks/perks.types"
import { Trait } from "lib/character/abilities/traits/traits.types"

import DrawerPage from "components/DrawerPage"
import Section from "components/Section"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import { useCharacter } from "contexts/CharacterContext"
import TraitPerkRow from "screens/MainTabs/PerksScreen/TraitPerkRow"

function PerksScreen() {
  const { traits, perks } = useCharacter()

  const [selectedElement, setSelectedElement] = useState<Perk | Trait | null>(null)

  const onPressElement = (element: Perk | Trait) => {
    setSelectedElement(prev => (prev?.id === element.id ? null : element))
  }

  return (
    <DrawerPage>
      <Section style={{ flex: 1 }}>
        {/* TRAITS */}
        {traits.length > 0 ? (
          <>
            <Txt>TRAITS</Txt>
            <Spacer y={10} />
            {traits.map(trait => (
              <TraitPerkRow
                key={trait.id}
                trait={trait}
                onPress={onPressElement}
                isSelected={selectedElement?.id === trait.id}
              />
            ))}
            <Spacer y={20} />
          </>
        ) : null}

        {/* PERKS */}
        {perks.length > 0 ? (
          <>
            <Txt>PERKS</Txt>
            <Spacer y={10} />
            <FlatList
              data={perks}
              keyExtractor={item => item.id}
              renderItem={({ item }) => {
                const isSelected = item.id === selectedElement?.id
                return (
                  <TraitPerkRow
                    isSelected={isSelected}
                    trait={item}
                    onPress={() => setSelectedElement(item)}
                  />
                )
              }}
            />
          </>
        ) : null}
      </Section>
      <Spacer x={10} />
      <View style={{ width: 200 }}>
        <Section style={{ width: 200 }}>
          <Txt>DESCRIPTION</Txt>
          <Spacer y={10} />
          <ScrollView>
            <Txt>{selectedElement?.description}</Txt>
            <Spacer y={10} />
          </ScrollView>
        </Section>
      </View>
    </DrawerPage>
  )
}

export default memo(PerksScreen)
