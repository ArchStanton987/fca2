import React, { memo, useMemo, useState } from "react"
import { FlatList, View } from "react-native"

import { router, useLocalSearchParams } from "expo-router"

import useCases from "lib/common/use-cases"
import { Consumable } from "lib/objects/data/consumables/consumables.types"

import AddElement from "components/AddElement"
import { DrawerParams } from "components/Drawer/Drawer.params"
import DrawerPage from "components/DrawerPage"
import Section from "components/Section"
import Spacer from "components/Spacer"
import routes from "constants/routes"
import { useCharacter } from "contexts/CharacterContext"
import { useInventory } from "contexts/InventoryContext"
import ConsumableDetails from "screens/InventoryTabs/ConsumablesScreen/ConsumableDetails"
import ConsumableRow, { ListHeader } from "screens/InventoryTabs/ConsumablesScreen/ConsumableRow"
import { SearchParams } from "screens/ScreenParams"

function ConsumablesScreen() {
  const localParams = useLocalSearchParams<SearchParams<DrawerParams>>()
  const [selectedItem, setSelectedItem] = useState<Consumable["dbKey"] | null>(null)
  const [isAscSort, setIsAscSort] = useState(true)

  const { groupedConsumables } = useInventory()
  const character = useCharacter()

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
    useCases.inventory.throw(character.charId, item)
    setSelectedItem(null)
  }

  const onPressHeader = () => setIsAscSort(prev => !prev)

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
      <Section style={{ flex: 1 }}>
        <FlatList
          data={sortedConsumables}
          keyExtractor={item => item.dbKey}
          ListHeaderComponent={<ListHeader onPress={onPressHeader} isAsc={isAscSort} />}
          stickyHeaderIndices={[0]}
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
      </Section>
      <Spacer x={10} />
      <View style={{ width: 180 }}>
        <Section style={{ width: 180, flex: 1 }}>
          <ConsumableDetails dbKey={selectedItem} />
        </Section>
        <Section style={{ width: 180 }}>
          <AddElement title="AJOUTER" onPressAdd={onPressAdd} />
        </Section>
      </View>
    </DrawerPage>
  )
}

export default memo(ConsumablesScreen)
