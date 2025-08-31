import React, { memo, useMemo, useState } from "react"
import { View } from "react-native"

import { router, useLocalSearchParams } from "expo-router"

import { getDamageEst } from "lib/common/utils/dice-calc"
import { Weapon } from "lib/objects/data/weapons/weapons.types"

import { DrawerParams } from "components/Drawer/Drawer.params"
import DrawerPage from "components/DrawerPage"
import List from "components/List"
import Section from "components/Section"
import ScrollSection from "components/Section/ScrollSection"
import { ComposedTitleProps } from "components/Section/Section.types"
import Spacer from "components/Spacer"
import PlusIcon from "components/icons/PlusIcon"
import routes from "constants/routes"
import { useCharacter } from "contexts/CharacterContext"
import { useInventory } from "contexts/InventoryContext"
import WeaponRow from "screens/InventoryTabs/WeaponsScreen/WeaponRow"
import WeaponsDetails from "screens/InventoryTabs/WeaponsScreen/WeaponsDetails"
import {
  WeaponSort,
  WeaponSortableKey
} from "screens/InventoryTabs/WeaponsScreen/WeaponsScreen.types"
import { SearchParams } from "screens/ScreenParams"
import layout from "styles/layout"

const getTitle = (cb: (str: WeaponSortableKey) => void): ComposedTitleProps => [
  {
    title: "equ",
    onPress: () => cb("equiped"),
    containerStyle: { width: 45 },
    lineStyle: { minWidth: 5 },
    titlePosition: "left",
    spacerWidth: 5
  },
  { title: "arme", onPress: () => cb("name"), containerStyle: { flex: 1 } },
  {
    title: "dég",
    onPress: () => cb("damage"),
    containerStyle: { width: 85 },
    lineStyle: { minWidth: 0 },
    titlePosition: "left"
  },
  {
    title: "comp",
    onPress: () => cb("skill"),
    containerStyle: { width: 37 },
    lineStyle: { minWidth: 0 },
    spacerWidth: 5
  },
  {
    title: "mun",
    onPress: () => cb("ammo"),
    containerStyle: { width: 40 },
    lineStyle: { minWidth: 0 },
    spacerWidth: 5
  },
  { title: "", containerStyle: { width: 32 }, lineStyle: { minWidth: 0 }, spacerWidth: 0 }
]

function WeaponsScreen() {
  const localParams = useLocalSearchParams<SearchParams<DrawerParams>>()
  const [selectedWeapon, setSelectedWeapon] = useState<Weapon | null>(null)
  const [sort, setSort] = useState<WeaponSort>({ type: "dbKey", isAsc: false })

  const char = useCharacter()
  const { weapons } = useInventory()

  const toggleSelect = (weapon: Weapon) =>
    setSelectedWeapon(prev => (prev?.dbKey === weapon.dbKey ? null : weapon))

  const onPressAdd = () =>
    router.push({
      pathname: routes.modal.updateObjects,
      params: { squadId: localParams.squadId, charId: localParams.charId, initCategory: "weapons" }
    })

  const onPressWeaponHeader = (type: WeaponSortableKey) => {
    setSort(prev => ({ type, isAsc: prev.type === type ? !prev.isAsc : true }))
  }
  const title = getTitle(onPressWeaponHeader)

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
      <ScrollSection style={{ flex: 1 }} contentContainerStyle={{ paddingRight: 0 }} title={title}>
        <List
          data={sortedWeapons}
          keyExtractor={item => item.dbKey}
          renderItem={({ item }) => (
            <WeaponRow
              weapon={item}
              isSelected={item.dbKey === selectedWeapon?.dbKey}
              onPress={() => toggleSelect(item)}
            />
          )}
        />
      </ScrollSection>

      <Spacer x={layout.globalPadding} />

      <View style={{ width: 130 }}>
        <ScrollSection style={{ flex: 1 }} title="détails">
          <WeaponsDetails charWeapon={selectedWeapon} />
        </ScrollSection>

        <Spacer y={layout.globalPadding} />

        <Section
          title="ajouter"
          contentContainerStyle={{ alignItems: "center", justifyContent: "center" }}
        >
          <PlusIcon onPress={onPressAdd} />
        </Section>
      </View>
    </DrawerPage>
  )
}

export default memo(WeaponsScreen)
