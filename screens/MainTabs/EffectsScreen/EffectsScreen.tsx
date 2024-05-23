import React, { useState } from "react"
import { FlatList, ScrollView, View } from "react-native"

import { router, useLocalSearchParams } from "expo-router"

import { Effect } from "lib/character/effects/effects.types"
import useCases from "lib/common/use-cases"

import AddElement from "components/AddElement"
import { DrawerParams } from "components/Drawer/Drawer.params"
import DrawerPage from "components/DrawerPage"
import Section from "components/Section"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import routes from "constants/routes"
import { useCharacter } from "contexts/CharacterContext"
import EffectRow, { EffectHeader } from "screens/MainTabs/EffectsScreen/EffectRow"
import { SearchParams } from "screens/ScreenParams"

export default function EffectsScreen() {
  const { squadId, charId } = useLocalSearchParams<SearchParams<DrawerParams>>()
  const [selectedId, setSelectedId] = useState<Effect["id"] | null>(null)

  const character = useCharacter()
  const { effects } = character

  const onPressAdd = () =>
    router.push({ pathname: routes.modal.updateEffects, params: { squadId, charId } })

  const onPressDelete = (effect: Effect) => {
    if (!effect.dbKey) return
    setSelectedId(null)
    useCases.effects.remove(character.charId, effect)
  }

  const selectedEffect = effects.find(effect => effect.id === selectedId)

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
                onPressDelete={() => onPressDelete(item)}
              />
            )
          }}
        />
      </Section>
      <Spacer x={10} />
      <View style={{ width: 200 }}>
        <Section style={{ width: 200, flex: 1 }}>
          <Txt>DESCRIPTION</Txt>
          <Spacer y={10} />
          <ScrollView>
            <Txt>{!!selectedEffect && selectedEffect.data.description}</Txt>
            <Spacer y={10} />
          </ScrollView>
        </Section>
        <Section style={{ width: 200 }}>
          <AddElement title="AJOUTER UN EFFET" onPressAdd={onPressAdd} />
        </Section>
      </View>
    </DrawerPage>
  )
}
