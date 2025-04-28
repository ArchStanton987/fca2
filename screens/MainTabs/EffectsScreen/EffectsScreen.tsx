import React, { memo, useState } from "react"
import { View } from "react-native"

import { router } from "expo-router"

import { Effect } from "lib/character/effects/effects.types"

import DrawerPage from "components/DrawerPage"
import List from "components/List"
import Section from "components/Section"
import ScrollSection from "components/Section/ScrollSection"
import { ComposedTitleProps } from "components/Section/Section.types"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import PlusIcon from "components/icons/PlusIcon"
import routes from "constants/routes"
import { useCharacter } from "contexts/CharacterContext"
import { useSquad } from "contexts/SquadContext"
import { useGetUseCases } from "providers/UseCasesProvider"
import EffectRow from "screens/MainTabs/EffectsScreen/EffectRow"
import layout from "styles/layout"

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

function EffectsScreen() {
  const useCases = useGetUseCases()
  const { squadId } = useSquad()
  const { effects, charId, isEnemy } = useCharacter()
  const charType = isEnemy ? "npcs" : "characters"

  const [selectedId, setSelectedId] = useState<Effect["id"] | null>(null)

  const onPressAdd = () =>
    router.push({
      pathname: routes.modal.updateEffects,
      params: { squadId, charId }
    })

  const onPressDelete = (effect: Effect) => {
    if (!effect.dbKey) return
    setSelectedId(null)
    useCases.effects.remove(charType, charId, effect)
  }

  const selectedEffect = effects.find(effect => effect.id === selectedId)

  return (
    <DrawerPage>
      <ScrollSection style={{ flex: 1 }} title={title}>
        <List
          data={effects}
          keyExtractor={item => item.dbKey || item.id}
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
      </ScrollSection>

      <Spacer x={layout.globalPadding} />

      <View style={{ width: 180 }}>
        <ScrollSection title="description" style={{ flex: 1 }}>
          <Txt>{!!selectedEffect && selectedEffect.data.description}</Txt>
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

export default memo(EffectsScreen)
