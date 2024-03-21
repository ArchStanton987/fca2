import React, { useState } from "react"
import { FlatList } from "react-native"

import { MiscObject } from "lib/objects/misc-objects/misc-objects-types"

import DrawerPage from "components/DrawerPage"
import Section from "components/Section"
import Spacer from "components/Spacer"
import { useInventory } from "contexts/InventoryContext"
import MiscObjDetails from "screens/InventoryTabs/MiscObjScreen/MiscObjDetails"
import MiscObjRow, { ListHeader } from "screens/InventoryTabs/MiscObjScreen/MiscObjRow"
import { filterUnique } from "utils/array-utils"

export default function MiscObjScreen() {
  const [selectedItem, setSelectedItem] = useState<MiscObject | null>(null)

  const { miscObjects } = useInventory()

  // TODO: group in inventory class
  const groupedObjects = filterUnique(
    "id",
    miscObjects.map((consumable, _, currArr) => {
      const count = currArr.filter(el => el.id === consumable.id).length
      return { ...consumable, count }
    })
  )

  return (
    <DrawerPage>
      <Section style={{ flex: 1 }}>
        <FlatList
          data={groupedObjects}
          keyExtractor={item => item.id}
          ListHeaderComponent={ListHeader}
          stickyHeaderIndices={[0]}
          renderItem={({ item }) => (
            <MiscObjRow
              objId={item.id}
              count={item.count}
              isSelected={item.id === selectedItem?.id}
              onPress={() => setSelectedItem(prev => (prev?.id === item.id ? null : item))}
            />
          )}
        />
      </Section>
      <Spacer x={10} />
      <Section style={{ width: 180 }}>
        <MiscObjDetails miscObj={selectedItem} />
      </Section>
    </DrawerPage>
  )
}
