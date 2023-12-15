import React, { useState } from "react"
import { FlatList } from "react-native"

import { useLocalSearchParams } from "expo-router"

import { DrawerParams } from "components/Drawer/Drawer.params"
import DrawerPage from "components/DrawerPage"
import Section from "components/Section"
import { useGetInventory } from "hooks/db/useGetInventory"
import { AmmoType } from "models/objects/ammo/ammo-types"
import AmmoRow, { ListHeader } from "screens/InventoryTabs/AmmoScreen/AmmoRow"
import { SearchParams } from "screens/ScreenParams"

export default function AmmoScreen() {
  const [selectedId, setSelectedId] = useState<AmmoType | null>(null)
  const { charId } = useLocalSearchParams() as SearchParams<DrawerParams>
  const { ammo } = useGetInventory(charId)

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
              ammoId={item.id}
              amount={item.amount}
              isSelected={selectedId === item.id}
              onPress={() => setSelectedId(prev => (prev === item.id ? null : item.id))}
            />
          )}
        />
      </Section>
    </DrawerPage>
  )
}
