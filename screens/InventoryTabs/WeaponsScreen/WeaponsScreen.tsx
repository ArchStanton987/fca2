import React, { useState } from "react"
import { ActivityIndicator, FlatList } from "react-native"

import { useLocalSearchParams } from "expo-router"

import { DrawerParams } from "components/Drawer/Drawer.params"
import DrawerPage from "components/DrawerPage"
import Section from "components/Section"
import Spacer from "components/Spacer"
import useGetEquipedObj from "hooks/db/useGetEquipedObj"
import { useGetInventory } from "hooks/db/useGetInventory"
import WeaponRow, { ListHeader } from "screens/InventoryTabs/WeaponsScreen/WeaponRow"
import WeaponsDetails from "screens/InventoryTabs/WeaponsScreen/WeaponsDetails"
import { SearchParams } from "screens/ScreenParams"
import colors from "styles/colors"

export default function WeaponsScreen() {
  const [selectedKey, setSelectedKey] = useState<string | null>(null)

  const { charId } = useLocalSearchParams() as SearchParams<DrawerParams>
  const inventory = useGetInventory(charId)
  const equipedObj = useGetEquipedObj(charId)

  const charWeapon = selectedKey
    ? inventory.weapons.find(el => el.dbKey === selectedKey)
    : undefined

  if (inventory === null || equipedObj === null)
    return <ActivityIndicator color={colors.secColor} />

  return (
    <DrawerPage>
      <Section style={{ flex: 1 }}>
        <FlatList
          data={inventory.weapons}
          keyExtractor={item => item.dbKey}
          ListHeaderComponent={ListHeader}
          stickyHeaderIndices={[0]}
          renderItem={({ item }) => (
            <WeaponRow
              weaponId={item.id}
              isSelected={item.dbKey === selectedKey}
              isEquiped={equipedObj.weapons.some(weapon => weapon.dbKey === item.dbKey)}
              skillScore={item.skill}
              onPress={() => setSelectedKey(item.dbKey)}
            />
          )}
        />
      </Section>
      <Spacer x={10} />
      <Section style={{ width: 130 }}>
        <WeaponsDetails charWeapon={charWeapon} />
      </Section>
    </DrawerPage>
  )
}
