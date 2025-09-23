import React, { memo, useState } from "react"
import { ScrollView, View } from "react-native"

import { useAbilities } from "lib/character/abilities/abilities-provider"
import perksMap from "lib/character/abilities/perks/perks"
import traitsMap from "lib/character/abilities/traits/traits"

import DrawerPage from "components/DrawerPage"
import List from "components/List"
import Section from "components/Section"
import ScrollSection from "components/Section/ScrollSection"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import TraitPerkRow from "screens/MainTabs/PerksScreen/TraitPerkRow"
import layout from "styles/layout"

function PerksScreen() {
  const { traits, perks } = useAbilities()
  const [selectedElement, setSelectedElement] = useState<string | null>(null)

  const onPressElement = (id: string) => {
    setSelectedElement(prev => (prev === id ? null : id))
  }

  const description = selectedElement
    ? { ...perksMap, ...traitsMap }?.[selectedElement]?.description
    : null
  return (
    <DrawerPage>
      <View style={{ flex: 1 }}>
        <Section title="traits" style={{ minHeight: 80 }}>
          <List
            data={Object.values(traits)}
            keyExtractor={t => t}
            renderItem={({ item }) => (
              <TraitPerkRow
                trait={traitsMap[item]}
                onPress={() => onPressElement(item)}
                isSelected={item === selectedElement}
              />
            )}
          />
        </Section>

        <Spacer y={layout.globalPadding} />

        <ScrollSection style={{ flex: 1, minHeight: 80 }} title="specs">
          <List
            data={Object.values(perks)}
            keyExtractor={p => p}
            renderItem={({ item }) => {
              const isSelected = item === selectedElement
              return (
                <TraitPerkRow
                  isSelected={isSelected}
                  trait={perksMap[item]}
                  onPress={() => onPressElement(item)}
                />
              )
            }}
          />
        </ScrollSection>
      </View>
      <Spacer x={10} />
      <Section title="description" style={{ width: 200 }}>
        <ScrollView>
          <Txt>{description}</Txt>
          <Spacer y={10} />
        </ScrollView>
      </Section>
    </DrawerPage>
  )
}

export default memo(PerksScreen)
