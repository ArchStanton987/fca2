import React, { useState } from "react"
import { FlatList, View } from "react-native"

import { router, useLocalSearchParams } from "expo-router"

import effectsMap from "lib/character/effects/effects"
import { EffectId } from "lib/character/effects/effects.types"

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
  const [selectedId, setSelectedId] = useState<EffectId | null>(null)

  const { effects } = useCharacter()

  const onPressAdd = () =>
    router.push({ pathname: routes.modal.updateEffects, params: { squadId, charId } })

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
          <Txt>{selectedId && effectsMap[selectedId].description}</Txt>
        </Section>
        <Section style={{ width: 200 }}>
          <AddElement title="AJOUTER UN EFFET" onPressAdd={onPressAdd} />
        </Section>
      </View>
    </DrawerPage>
  )
}
