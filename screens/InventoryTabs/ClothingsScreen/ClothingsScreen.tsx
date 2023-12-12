import React, { useState } from "react"
import { ActivityIndicator, FlatList } from "react-native"

import { useLocalSearchParams } from "expo-router/src/hooks"

import { DrawerParams } from "components/Drawer/Drawer.params"
import DrawerPage from "components/DrawerPage"
import Section from "components/Section"
import Spacer from "components/Spacer"
import useGetEquipedObj from "hooks/db/useGetEquipedObj"
import { useGetInventory } from "hooks/db/useGetInventory"
import ClothingRow, { ListHeader } from "screens/InventoryTabs/ClothingsScreen/ClothingRow"
import ClothingsDetails from "screens/InventoryTabs/ClothingsScreen/ClothingsDetails"
import { SearchParams } from "screens/ScreenParams"
import colors from "styles/colors"

export default function ClothingsScreen() {
  const [selectedKey, setSelectedKey] = useState<string | null>(null)

  const { charId } = useLocalSearchParams() as SearchParams<DrawerParams>
  const inventory = useGetInventory(charId)
  const equipedObj = useGetEquipedObj(charId)

  const charClothing = selectedKey
    ? inventory.clothings.find(el => el.dbKey === selectedKey)
    : undefined

  if (inventory === null || equipedObj === null)
    return <ActivityIndicator color={colors.secColor} />

  return (
    <DrawerPage>
      <Section style={{ flex: 1 }}>
        <FlatList
          data={inventory.clothings}
          keyExtractor={item => item.dbKey}
          ListHeaderComponent={ListHeader}
          stickyHeaderIndices={[0]}
          renderItem={({ item }) => (
            <ClothingRow
              clothingId={item.id}
              isSelected={item.dbKey === selectedKey}
              isEquiped={equipedObj.clothings.some(cloth => cloth.dbKey === item.dbKey)}
              onPress={() => setSelectedKey(item.dbKey)}
            />
          )}
        />
      </Section>
      <Spacer x={10} />
      <Section style={{ width: 120 }}>
        <Spacer y={10} />
        <ClothingsDetails charClothing={charClothing} />
      </Section>
    </DrawerPage>
  )
}
