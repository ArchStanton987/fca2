import React, { useState } from "react"
import { FlatList } from "react-native"

import { Consumable } from "lib/objects/data/consumables/consumables.types"

import DrawerPage from "components/DrawerPage"
import Section from "components/Section"
import Spacer from "components/Spacer"
import { useInventory } from "contexts/InventoryContext"
import ConsumableDetails from "screens/InventoryTabs/ConsumablesScreen/ConsumableDetails"
import ConsumableRow, { ListHeader } from "screens/InventoryTabs/ConsumablesScreen/ConsumableRow"
import { filterUnique } from "utils/array-utils"

export default function ConsumablesScreen() {
  const [selectedItem, setSelectedItem] = useState<Consumable | null>(null)

  const { consumables } = useInventory()

  // TODO: GROUP in Inventory class
  const groupedConsumables = filterUnique(
    "id",
    consumables.map((consumable, _, currArr) => {
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
              isSelected={item.id === selectedItem?.id}
              count={item.count}
              onPress={() => setSelectedItem(item)}
            />
          )}
        />
      </Section>
      <Spacer x={10} />
      <Section style={{ width: 180 }}>
        <ConsumableDetails charConsumable={selectedItem} />
      </Section>
    </DrawerPage>
  )
}
