import React, { useState } from "react"
import { FlatList } from "react-native"

import { Ammo } from "lib/objects/data/ammo/ammo.types"

import DrawerPage from "components/DrawerPage"
import Section from "components/Section"
import { useInventory } from "contexts/InventoryContext"
import AmmoRow, { ListHeader } from "screens/InventoryTabs/AmmoScreen/AmmoRow"

export default function AmmoScreen() {
  const [selectedAmmo, setSelectedAmmo] = useState<Ammo | null>(null)

  const { ammo } = useInventory()
  return (
    <DrawerPage>
      <Section style={{ flex: 1 }}>
        <FlatList
          data={ammo}
          keyExtractor={item => item.id}
          ListHeaderComponent={ListHeader}
          stickyHeaderIndices={[0]}
          renderItem={({ item }) => (
            <AmmoRow
              ammo={item}
              isSelected={selectedAmmo?.id === item.id}
              onPress={() => setSelectedAmmo(prev => (prev?.id === item.id ? null : item))}
            />
          )}
        />
      </Section>
    </DrawerPage>
  )
}
