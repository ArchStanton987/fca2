import React, { memo, useMemo, useState } from "react"
import { View } from "react-native"

import { router, useLocalSearchParams } from "expo-router"

import { Consumable } from "lib/objects/data/consumables/consumables.types"

import { DrawerParams } from "components/Drawer/Drawer.params"
import DrawerPage from "components/DrawerPage"
import List from "components/List"
import Section from "components/Section"
import ScrollSection from "components/Section/ScrollSection"
import { ComposedTitleProps } from "components/Section/Section.types"
import Spacer from "components/Spacer"
import PlusIcon from "components/icons/PlusIcon"
import routes from "constants/routes"
import { useCharacter } from "contexts/CharacterContext"
import { useInventory } from "contexts/InventoryContext"
import { useGetUseCases } from "providers/UseCasesProvider"
import ConsumableDetails from "screens/InventoryTabs/ConsumablesScreen/ConsumableDetails"
import ConsumableRow from "screens/InventoryTabs/ConsumablesScreen/ConsumableRow"
import { SearchParams } from "screens/ScreenParams"
import layout from "styles/layout"

const getTitle = (cb: (str: string) => void): ComposedTitleProps => [
  { title: "produit", onPress: () => cb("label"), containerStyle: { flex: 1 } },
  { title: "effets", onPress: () => {}, containerStyle: { width: 90 }, titlePosition: "right" },
  { title: "", containerStyle: { width: 27 }, lineStyle: { minWidth: 0 }, spacerWidth: 0 }
]

function ConsumablesScreen() {
  const useCases = useGetUseCases()
  const localParams = useLocalSearchParams<SearchParams<DrawerParams>>()
  const [selectedItem, setSelectedItem] = useState<Consumable["dbKey"] | null>(null)
  const [isAscSort, setIsAscSort] = useState(true)

  const { groupedConsumables } = useInventory()
  const character = useCharacter()
  const charType = character.isEnemy ? "npcs" : "characters"

  const onPressAdd = () =>
    router.push({
      pathname: routes.modal.updateObjects,
      params: {
        squadId: localParams.squadId,
        charId: localParams.charId,
        initCategory: "consumables"
      }
    })

  const onDelete = (item: Consumable) => {
    useCases.inventory.throw(charType, character.charId, item)
    setSelectedItem(null)
  }

  const onPressHeader = () => setIsAscSort(prev => !prev)
  const title = getTitle(onPressHeader)

  const sortedConsumables = useMemo(() => {
    const sortFn = (a: Consumable, b: Consumable) => {
      if (isAscSort) return a.data.label.localeCompare(b.data.label)
      return b.data.label.localeCompare(a.data.label)
    }
    const sorted = groupedConsumables.sort(sortFn)
    return sorted
  }, [groupedConsumables, isAscSort])

  return (
    <DrawerPage>
      <ScrollSection style={{ flex: 1 }} title={title}>
        <List
          data={sortedConsumables}
          keyExtractor={item => item.dbKey}
          renderItem={({ item }) => (
            <ConsumableRow
              charConsumable={item}
              isSelected={item.dbKey === selectedItem}
              count={item.count}
              onPress={() => setSelectedItem(item.dbKey)}
              onDelete={() => onDelete(item)}
            />
          )}
        />
      </ScrollSection>
      <Spacer x={layout.globalPadding} />
      <View style={{ width: 180 }}>
        <ScrollSection style={{ flex: 1 }} title="détails">
          <ConsumableDetails dbKey={selectedItem} />
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

export default memo(ConsumablesScreen)
