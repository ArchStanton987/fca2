import React, { useState } from "react"
import { FlatList } from "react-native"

import { Weapon } from "lib/objects/data/weapons/weapons.types"

import DrawerPage from "components/DrawerPage"
import Section from "components/Section"
import Spacer from "components/Spacer"
import { useInventory } from "contexts/InventoryContext"
import WeaponRow, { ListHeader } from "screens/InventoryTabs/WeaponsScreen/WeaponRow"
import WeaponsDetails from "screens/InventoryTabs/WeaponsScreen/WeaponsDetails"

export default function WeaponsScreen() {
  const [selectedWeapon, setSelectedWeapon] = useState<Weapon | null>(null)

  const { weapons } = useInventory()

  return (
    <DrawerPage>
      <Section style={{ flex: 1 }}>
        <FlatList
          data={weapons}
          keyExtractor={item => item.dbKey}
          ListHeaderComponent={ListHeader}
          stickyHeaderIndices={[0]}
          renderItem={({ item }) => (
            <WeaponRow
              weapon={item}
              isSelected={item.dbKey === selectedWeapon?.dbKey}
              onPress={() => setSelectedWeapon(item)}
            />
          )}
        />
      </Section>
      <Spacer x={10} />
      <Section style={{ width: 130 }}>
        <WeaponsDetails charWeapon={selectedWeapon} />
      </Section>
    </DrawerPage>
  )
}
