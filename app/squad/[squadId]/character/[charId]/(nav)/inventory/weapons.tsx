import React, { useMemo, useState } from "react"
import { View } from "react-native"

import { router, useLocalSearchParams } from "expo-router"

import { useAbilities, useSecAttr } from "lib/character/abilities/abilities-provider"
import { useCharInfo } from "lib/character/info/info-provider"
import { useAmmo, useItems } from "lib/inventory/use-sub-inv-cat"
import { useBarterActions } from "lib/objects/barter-store"
import Weapon from "lib/objects/data/weapons/Weapon"
import WeaponRow from "lib/objects/data/weapons/ui/WeaponRow"
import WeaponsDetails from "lib/objects/data/weapons/ui/WeaponsDetails"
import { WeaponSort, WeaponSortableKey } from "lib/objects/data/weapons/ui/WeaponsScreen.types"

import DrawerPage from "components/DrawerPage"
import List from "components/List"
import Section from "components/Section"
import ScrollSection from "components/Section/ScrollSection"
import { ComposedTitleProps } from "components/Section/Section.types"
import Spacer from "components/Spacer"
import PlusIcon from "components/icons/PlusIcon"
import routes from "constants/routes"
import layout from "styles/layout"
import { filterUnique } from "utils/array-utils"

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

export default function WeaponsScreen() {
  const { charId, squadId } = useLocalSearchParams<{ charId: string; squadId: string }>()
  const [selectedWeapon, setSelectedWeapon] = useState<string | null>(null)
  const [sort, setSort] = useState<WeaponSort>({ type: "dbKey", isAsc: false })

  const { data: allWeapons } = useItems(charId, items =>
    Object.values(items).filter(i => i.category === "weapons")
  )
  const weapons = filterUnique("id", allWeapons)

  const { data: abilities } = useAbilities(charId)
  const { data: secAttr } = useSecAttr(charId)
  const { data: charInfo } = useCharInfo(charId)
  const { data: ammo } = useAmmo(charId)

  const barterActions = useBarterActions()

  const toggleSelect = (weapon: Weapon) =>
    setSelectedWeapon(prev => (prev === weapon.dbKey ? null : weapon.dbKey))

  const onPressAdd = () => {
    barterActions.selectCategory("weapons")
    router.push({
      pathname: routes.modal.barter,
      params: { squadId, charId }
    })
  }

  const onPressWeaponHeader = (type: WeaponSortableKey) => {
    setSort(prev => ({ type, isAsc: prev.type === type ? !prev.isAsc : true }))
  }
  const title = getTitle(onPressWeaponHeader)

  const sortedWeapons = useMemo(() => {
    const sortFn = (a: Weapon, b: Weapon) => {
      if (sort.type === "dbKey") return b.dbKey.localeCompare(a.dbKey)
      if (sort.type === "name") return b.data.label.localeCompare(a.data.label)
      if (sort.type === "damage")
        return Weapon.getDamageEst(secAttr, a) > Weapon.getDamageEst(secAttr, b) ? 1 : -1
      if (sort.type === "skill")
        return b.getSkillScore(abilities, charInfo) > a.getSkillScore(abilities, charInfo) ? -1 : 1
      if (sort.type === "ammo")
        return (b.getAmmoCount(ammo) ?? 0) > (a.getAmmoCount(ammo) ?? 0) ? -1 : 1
      if (sort.type === "equiped") return a.isEquipped ? 1 : -1
      return 0
    }
    const sorted = weapons.sort(sortFn)
    return sort.isAsc ? sorted : sorted.reverse()
  }, [weapons, sort, abilities, ammo, secAttr, charInfo])

  return (
    <DrawerPage>
      <ScrollSection style={{ flex: 1 }} contentContainerStyle={{ paddingRight: 0 }} title={title}>
        <List
          data={sortedWeapons}
          keyExtractor={item => item.dbKey}
          renderItem={({ item }) => (
            <WeaponRow
              charId={charId}
              weapon={item}
              isSelected={item.dbKey === selectedWeapon}
              onPress={() => toggleSelect(item)}
            />
          )}
        />
      </ScrollSection>

      <Spacer x={layout.globalPadding} />

      <View style={{ width: 130 }}>
        <ScrollSection style={{ flex: 1 }} title="détails">
          <WeaponsDetails itemDbKey={selectedWeapon} />
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
