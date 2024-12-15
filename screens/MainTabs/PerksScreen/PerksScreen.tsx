import React, { memo, useState } from "react"
import { ScrollView, View } from "react-native"

import { Perk } from "lib/character/abilities/perks/perks.types"
import { Trait } from "lib/character/abilities/traits/traits.types"

import DrawerPage from "components/DrawerPage"
import List from "components/List"
import Section from "components/Section"
import ScrollSection from "components/Section/ScrollSection"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import { useCharacter } from "contexts/CharacterContext"
import TraitPerkRow from "screens/MainTabs/PerksScreen/TraitPerkRow"
import layout from "styles/layout"

function PerksScreen() {
  const { traits, perks } = useCharacter()

  const [selectedElement, setSelectedElement] = useState<Perk | Trait | null>(null)

  const onPressElement = (element: Perk | Trait) => {
    setSelectedElement(prev => (prev?.id === element.id ? null : element))
  }

  return (
    <DrawerPage>
      <View style={{ flex: 1 }}>
        <Section title="traits" style={{ minHeight: 80 }}>
          {traits.length > 0 ? (
            <List
              data={traits}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <TraitPerkRow
                  trait={item}
                  onPress={() => onPressElement(item)}
                  isSelected={item.id === selectedElement?.id}
                />
              )}
            />
          ) : null}
        </Section>

        <Spacer y={layout.globalPadding} />

        <ScrollSection style={{ flex: 1, minHeight: 80 }} title="specs">
          {perks.length > 0 ? (
            <List
              data={perks}
              keyExtractor={item => item.id}
              renderItem={({ item }) => {
                const isSelected = item.id === selectedElement?.id
                return (
                  <TraitPerkRow
                    isSelected={isSelected}
                    trait={item}
                    onPress={() => onPressElement(item)}
                  />
                )
              }}
            />
          ) : null}
        </ScrollSection>
      </View>
      <Spacer x={10} />
      <Section title="description" style={{ width: 200 }}>
        <ScrollView>
          <Txt>{selectedElement?.description}</Txt>
          <Spacer y={10} />
        </ScrollView>
      </Section>
    </DrawerPage>
  )
}

export default memo(PerksScreen)
