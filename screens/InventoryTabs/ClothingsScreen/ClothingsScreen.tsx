import React, { useState } from "react"
import { FlatList } from "react-native"

import { Clothing } from "lib/objects/clothings/clothings.types"

import DrawerPage from "components/DrawerPage"
import Section from "components/Section"
import Spacer from "components/Spacer"
import { useInventory } from "contexts/InventoryContext"
import ClothingRow, { ListHeader } from "screens/InventoryTabs/ClothingsScreen/ClothingRow"
import ClothingsDetails from "screens/InventoryTabs/ClothingsScreen/ClothingsDetails"

export default function ClothingsScreen() {
  const [selectedCloth, setSelectedCloth] = useState<Clothing | null>(null)

  const { clothings } = useInventory()

  return (
    <DrawerPage>
      <Section style={{ flex: 1 }}>
        <FlatList
          data={clothings}
          keyExtractor={item => item.dbKey}
          ListHeaderComponent={ListHeader}
          stickyHeaderIndices={[0]}
          renderItem={({ item }) => (
            <ClothingRow
              clothing={item}
              isSelected={item.dbKey === selectedCloth?.dbKey}
              onPress={() => setSelectedCloth(item)}
            />
          )}
        />
      </Section>
      <Spacer x={10} />
      <Section style={{ width: 120 }}>
        <ClothingsDetails charClothing={selectedCloth} />
      </Section>
    </DrawerPage>
  )
}
