import React, { useState } from "react"
import { FlatList, View } from "react-native"

import { useLocalSearchParams } from "expo-router"

import { DrawerParams } from "components/Drawer/Drawer.params"
import DrawerPage from "components/DrawerPage"
import Section from "components/Section"
import Txt from "components/Txt"
import useGetEffects from "hooks/db/useGetEffects"
import { EffectId } from "models/character/effects/effect-types"
import effectsMap from "models/character/effects/effects"
import LoadingScreen from "screens/LoadingScreen"
import EffectRow from "screens/MainTabs/EffectsScreen/EffectRow"
import { SearchParams } from "screens/ScreenParams"

export default function EffectsScreen() {
  const [selectedId, setSelectedId] = useState<EffectId | null>(null)

  const { charId } = useLocalSearchParams() as SearchParams<DrawerParams>
  const effects = useGetEffects(charId)

  if (effects === null) return <LoadingScreen />

  return (
    <DrawerPage>
      <Section style={{ flex: 1 }}>
        <FlatList
          data={effects}
          keyExtractor={item => item.dbKey}
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
      <View style={{ width: 200 }}>
        <Txt>DESCRIPTION</Txt>
        <Txt>{selectedId && effectsMap[selectedId].description}</Txt>
      </View>
    </DrawerPage>
  )
}
