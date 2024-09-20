import React, { useMemo, useState } from "react"
import { FlatList, View } from "react-native"

import { getDamageEst } from "lib/common/utils/dice-calc"
import { Weapon } from "lib/objects/data/weapons/weapons.types"
import { InvBottomTabScreenProps } from "nav/nav.types"

import AddElement from "components/AddElement"
import DrawerPage from "components/DrawerPage"
import Section from "components/Section"
import Spacer from "components/Spacer"
import { useCharacter } from "contexts/CharacterContext"
import { useInventory } from "contexts/InventoryContext"
import WeaponRow, { ListHeader } from "screens/InventoryTabs/WeaponsScreen/WeaponRow"
import WeaponsDetails from "screens/InventoryTabs/WeaponsScreen/WeaponsDetails"
import {
  WeaponSort,
  WeaponSortableKey
} from "screens/InventoryTabs/WeaponsScreen/WeaponsScreen.types"

export default function WeaponsScreen({ navigation }: InvBottomTabScreenProps<"Armes">) {
  const [selectedWeapon, setSelectedWeapon] = useState<Weapon | null>(null)
  const [sort, setSort] = useState<WeaponSort>({ type: "dbKey", isAsc: false })

  const char = useCharacter()
  const { weapons } = useInventory()

  const toggleSelect = (weapon: Weapon) =>
    setSelectedWeapon(prev => (prev?.dbKey === weapon.dbKey ? null : weapon))

  const onPressAdd = () => navigation.push("UpdateObjects", { initCategory: "weapons" })

  const onPressWeaponHeader = (type: WeaponSortableKey) => {
    setSort(prev => ({ type, isAsc: prev.type === type ? !prev.isAsc : true }))
  }

  const sortedWeapons = useMemo(() => {
    const sortFn = (a: Weapon, b: Weapon) => {
      if (sort.type === "dbKey") return b.dbKey.localeCompare(a.dbKey)
      if (sort.type === "name") return b.data.label.localeCompare(a.data.label)
      if (sort.type === "damage") return getDamageEst(char, a) > getDamageEst(char, b) ? 1 : -1
      if (sort.type === "skill") return b.skill > a.skill ? -1 : 1
      if (sort.type === "ammo") return b.ammo > a.ammo ? -1 : 1
      if (sort.type === "equiped") return a.isEquiped ? 1 : -1
      return 0
    }
    const sorted = weapons.sort(sortFn)
    return sort.isAsc ? sorted : sorted.reverse()
  }, [weapons, sort, char])

  return (
    <DrawerPage>
      <Section style={{ flex: 1 }}>
        <FlatList
          data={sortedWeapons}
          keyExtractor={item => item.dbKey}
          ListHeaderComponent={<ListHeader onPress={onPressWeaponHeader} sortState={sort} />}
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
        <Section style={{ width: 130, flex: 1 }}>
          <WeaponsDetails charWeapon={selectedWeapon} />
        </Section>
        <Section style={{ width: 130 }}>
          <AddElement title="AJOUTER" onPressAdd={onPressAdd} />
        </Section>
      </View>
    </DrawerPage>
  )
}
