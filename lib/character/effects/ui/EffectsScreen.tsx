import React, { useState } from "react"
import { View } from "react-native"

import { router, useLocalSearchParams } from "expo-router"

import DrawerPage from "components/DrawerPage"
import List from "components/List"
import Section from "components/Section"
import ScrollSection from "components/Section/ScrollSection"
import { ComposedTitleProps } from "components/Section/Section.types"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import PlusIcon from "components/icons/PlusIcon"
import { useCollectiblesData } from "providers/AdditionalElementsProvider"
import { useGetUseCases } from "providers/UseCasesProvider"
import layout from "styles/layout"

import Effect from "../Effect"
import { useCharEffects } from "../effects-provider"
import EffectRow from "./EffectRow"

const title: ComposedTitleProps = [
  { title: "effet", containerStyle: { flex: 1 } },
  {
    title: "sympt",
    titlePosition: "left",
    containerStyle: { width: 80 },
    lineStyle: { minWidth: 0 },
    spacerWidth: 5
  },
  {
    title: "reste",
    containerStyle: { width: 70 },
    titlePosition: "right",
    lineStyle: { minWidth: 0 },
    spacerWidth: 5
  },
  {
    title: "",
    containerStyle: { width: 37 },
    lineStyle: { width: 0, minWidth: 0 },
    spacerWidth: 0
  }
]

export default function EffectsScreen() {
  const { charId, squadId } = useLocalSearchParams<{ charId: string; squadId: string }>()
  const useCases = useGetUseCases()
  const allEffects = useCollectiblesData().effects

  const [selectedId, setSelectedId] = useState<Effect["id"] | null>(null)

  const { data: effects } = useCharEffects(charId)

  const onPressAdd = () =>
    router.push({
      pathname: "/squad/[squadId]/character/[charId]/update-effects",
      params: { squadId, charId }
    })

  const onPressDelete = (effect: Effect) => {
    if (!effect.dbKey) return
    setSelectedId(null)
    useCases.character.removeEffect({ charId, dbKey: effect.dbKey })
  }

  return (
    <DrawerPage>
      <ScrollSection style={{ flex: 1 }} title={title}>
        <List
          data={Object.values(effects)}
          keyExtractor={item => item.dbKey || item.id}
          renderItem={({ item }) => (
            <EffectRow
              isSelected={item.id === selectedId}
              effect={item}
              onPress={() => setSelectedId(item.id)}
              onPressDelete={() => onPressDelete(item)}
            />
          )}
        />
      </ScrollSection>

      <Spacer x={layout.globalPadding} />

      <View style={{ width: 180 }}>
        <ScrollSection title="description" style={{ flex: 1 }}>
          <Txt>{selectedId ? allEffects[selectedId].description : null}</Txt>
        </ScrollSection>

        <Spacer y={layout.globalPadding} />

        <Section title="ajouter">
          <View style={{ alignItems: "center" }}>
            <PlusIcon onPress={onPressAdd} />
          </View>
        </Section>
      </View>
    </DrawerPage>
  )
}
