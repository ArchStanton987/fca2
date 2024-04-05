import React, { useState } from "react"
import { FlatList, View } from "react-native"

import { router, useLocalSearchParams } from "expo-router"

import { Weapon } from "lib/objects/data/weapons/weapons.types"

import AddElement from "components/AddElement"
import { DrawerParams } from "components/Drawer/Drawer.params"
import DrawerPage from "components/DrawerPage"
import Section from "components/Section"
import Spacer from "components/Spacer"
import routes from "constants/routes"
import { useInventory } from "contexts/InventoryContext"
import WeaponRow, { ListHeader } from "screens/InventoryTabs/WeaponsScreen/WeaponRow"
import WeaponsDetails from "screens/InventoryTabs/WeaponsScreen/WeaponsDetails"
import { SearchParams } from "screens/ScreenParams"

export default function WeaponsScreen() {
  const localParams = useLocalSearchParams<SearchParams<DrawerParams>>()
  const [selectedWeapon, setSelectedWeapon] = useState<Weapon | null>(null)

  const { weapons } = useInventory()

  const toggleSelect = (weapon: Weapon) =>
    setSelectedWeapon(prev => (prev?.dbKey === weapon.dbKey ? null : weapon))

  const onPressAdd = () =>
    router.push({
      pathname: routes.modal.updateObjects,
      params: { squadId: localParams.squadId, charId: localParams.charId, initCategory: "weapons" }
    })

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
              onPress={() => toggleSelect(item)}
            />
          )}
        />
      </Section>
      <Spacer x={10} />
      <View style={{ width: 130 }}>
        <Section style={{ width: 130, flexGrow: 1 }}>
          <WeaponsDetails charWeapon={selectedWeapon} />
        </Section>
        <Section style={{ width: 130 }}>
          <AddElement title="AJOUTER" onPressAdd={onPressAdd} />
        </Section>
      </View>
    </DrawerPage>
  )
}
