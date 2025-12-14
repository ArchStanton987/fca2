import React, { useMemo, useState } from "react"
import { View } from "react-native"

import { router, useLocalSearchParams } from "expo-router"

import { useItems } from "lib/inventory/use-sub-inv-cat"
import { useBarterActions } from "lib/objects/barter-store"
import Consumable from "lib/objects/data/consumables/Consumable"
import ConsumableDetails from "lib/objects/data/consumables/ui/ConsumableDetails"
import ConsumableRow from "lib/objects/data/consumables/ui/ConsumableRow"

import DrawerPage from "components/DrawerPage"
import List from "components/List"
import Section from "components/Section"
import ScrollSection from "components/Section/ScrollSection"
import { ComposedTitleProps } from "components/Section/Section.types"
import Spacer from "components/Spacer"
import PlusIcon from "components/icons/PlusIcon"
import { useGetUseCases } from "providers/UseCasesProvider"
import layout from "styles/layout"
import { filterUnique } from "utils/array-utils"

const getTitle = (cb: (str: string) => void): ComposedTitleProps => [
  { title: "produit", onPress: () => cb("label"), containerStyle: { flex: 1 } },
  { title: "effets", onPress: () => {}, containerStyle: { width: 90 }, titlePosition: "right" },
  { title: "", containerStyle: { width: 27 }, lineStyle: { minWidth: 0 }, spacerWidth: 0 }
]

export default function ConsumablesScreen() {
  const { charId, squadId } = useLocalSearchParams<{ charId: string; squadId: string }>()
  const useCases = useGetUseCases()
  const [selectedItem, setSelectedItem] = useState<string | null>(null)
  const [isAscSort, setIsAscSort] = useState(true)

  const barterActions = useBarterActions()

  const { data: allConsumables } = useItems(charId, allItems =>
    Object.values(allItems).filter(el => el.category === "consumables")
  )
  const consumables = filterUnique("id", allConsumables)

  const onPressAdd = () => {
    barterActions.selectCategory("consumables")
    router.push({
      pathname: "/squad/[squadId]/character/[charId]/barter",
      params: { squadId, charId }
    })
  }

  const onDelete = (item: Consumable) => {
    useCases.inventory.drop({ charId, item })
    setSelectedItem(null)
  }

  const onPressHeader = () => setIsAscSort(prev => !prev)
  const title = getTitle(onPressHeader)

  const sortedConsumables = useMemo(() => {
    const sortFn = (a: Consumable, b: Consumable) => {
      if (isAscSort) return a.data.label.localeCompare(b.data.label)
      return b.data.label.localeCompare(a.data.label)
    }
    const sorted = consumables.sort(sortFn)
    return sorted
  }, [consumables, isAscSort])

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
              onPress={() => setSelectedItem(item.dbKey)}
              onDelete={() => onDelete(item)}
            />
          )}
        />
      </ScrollSection>
      <Spacer x={layout.globalPadding} />
      <View style={{ width: 180 }}>
        <ScrollSection style={{ flex: 1 }} title="détails">
          <ConsumableDetails charId={charId} dbKey={selectedItem} />
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
