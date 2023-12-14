import React, { useState } from "react"
import { FlatList } from "react-native"

import { useLocalSearchParams } from "expo-router"

import { DrawerParams } from "components/Drawer/Drawer.params"
import DrawerPage from "components/DrawerPage"
import Section from "components/Section"
import Spacer from "components/Spacer"
import { useGetInventory } from "hooks/db/useGetInventory"
import { ConsumableId } from "models/objects/consumable/consumables-types"
import ConsumableDetails from "screens/InventoryTabs/ConsumablesScreen/ConsumableDetails"
import ConsumableRow, { ListHeader } from "screens/InventoryTabs/ConsumablesScreen/ConsumableRow"
import { SearchParams } from "screens/ScreenParams"
import { filterUnique } from "utils/array-utils"

export default function ConsumablesScreen() {
  const [selectedId, setSelectedId] = useState<ConsumableId | null>(null)

  const { charId } = useLocalSearchParams() as SearchParams<DrawerParams>
  const inventory = useGetInventory(charId)

  const selectedConsumable = selectedId
    ? inventory.consumables.find(el => el.id === selectedId)
    : undefined

  const groupedConsumables = filterUnique(
    "id",
    inventory.consumables.map((consumable, _, currArr) => {
      const count = currArr.filter(el => el.id === consumable.id).length
      return { ...consumable, count }
    })
  )

  return (
    <DrawerPage>
      <Section style={{ flex: 1 }}>
        <FlatList
          data={groupedConsumables}
          keyExtractor={item => item.dbKey}
          ListHeaderComponent={ListHeader}
          stickyHeaderIndices={[0]}
          renderItem={({ item }) => (
            <ConsumableRow
              charConsumable={item}
              isSelected={item.id === selectedId}
              count={item.count}
              onPress={() => setSelectedId(item.id)}
            />
          )}
        />
      </Section>
      <Spacer x={10} />
      <Section style={{ width: 120 }}>
        <Spacer y={10} />
        <ConsumableDetails charConsumable={selectedConsumable} />
      </Section>
    </DrawerPage>
  )
}
