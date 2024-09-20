import React, { useMemo, useState } from "react"
import { FlatList, View } from "react-native"

import { Clothing } from "lib/objects/data/clothings/clothings.types"
import { InvBottomTabScreenProps } from "nav/nav.types"

import AddElement from "components/AddElement"
import DrawerPage from "components/DrawerPage"
import Section from "components/Section"
import Spacer from "components/Spacer"
import { useInventory } from "contexts/InventoryContext"
import ClothingRow, { ListHeader } from "screens/InventoryTabs/ClothingsScreen/ClothingRow"
import ClothingsDetails from "screens/InventoryTabs/ClothingsScreen/ClothingsDetails"

import { ClothingSort, ClothingSortableKey } from "./ClothingsScreen.types"

export default function ClothingsScreen({ navigation }: InvBottomTabScreenProps<"Protections">) {
  const [selectedCloth, setSelectedCloth] = useState<Clothing | null>(null)
  const [sort, setSort] = useState<ClothingSort>({ type: "dbKey", isAsc: false })

  const { clothings } = useInventory()

  const onPressAdd = () => navigation.push("UpdateObjects", { initCategory: "clothings" })

  const onPressClothingHeader = (type: ClothingSortableKey) => {
    setSort(prev => ({ type, isAsc: prev.type === type ? !prev.isAsc : true }))
  }

  const sortedClothings = useMemo(() => {
    const sortFn = (a: Clothing, b: Clothing) => {
      if (sort.type === "dbKey") return b.dbKey.localeCompare(a.dbKey)
      if (sort.type === "name") return b.data.label.localeCompare(a.data.label)
      if (sort.type === "physRes")
        return b.data.physicalDamageResist > a.data.physicalDamageResist ? -1 : 1
      if (sort.type === "lasRes")
        return b.data.laserDamageResist > a.data.laserDamageResist ? -1 : 1
      if (sort.type === "fireRes") return b.data.fireDamageResist > a.data.fireDamageResist ? -1 : 1
      if (sort.type === "plaRes")
        return b.data.plasmaDamageResist > a.data.plasmaDamageResist ? -1 : 1
      if (sort.type === "malus") return b.data.malus > a.data.malus ? -1 : 1
      return 0
    }
    const sorted = clothings.sort(sortFn)
    return sort.isAsc ? sorted : sorted.reverse()
  }, [clothings, sort])

  return (
    <DrawerPage>
      <Section style={{ flex: 1 }}>
        <FlatList
          data={sortedClothings}
          keyExtractor={item => item.dbKey}
          ListHeaderComponent={<ListHeader sortState={sort} onPress={onPressClothingHeader} />}
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
      <View style={{ width: 120 }}>
        <Section style={{ width: 120, flex: 1 }}>
          <ClothingsDetails charClothing={selectedCloth} />
        </Section>
        <Section style={{ width: 120 }}>
          <AddElement title="AJOUTER" onPressAdd={onPressAdd} />
        </Section>
      </View>
    </DrawerPage>
  )
}
