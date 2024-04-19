import React, { useState } from "react"
import { FlatList, View } from "react-native"

import { router, useLocalSearchParams } from "expo-router"

import { Effect } from "lib/character/effects/effects.types"
import { effectsController } from "lib/common/controllers"

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
    effectsController.remove(character.charId, effect)
  }

  const selectedEffect = effects.find(effect => effect.id === selectedId)

  return (
    <DrawerPage style={{ flex: 1 }}>
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
        <Section style={{ width: 200, flexGrow: 1 }}>
          <Txt>DESCRIPTION</Txt>
          <Spacer y={10} />
          <Txt>{!!selectedEffect && selectedEffect.data.description}</Txt>
        </Section>
        <Section style={{ width: 200 }}>
          <AddElement title="AJOUTER UN EFFET" onPressAdd={onPressAdd} />
        </Section>
      </View>
    </DrawerPage>
  )
}
