import React, { memo, useMemo, useState } from "react"
import { FlatList, View } from "react-native"

import { router, useLocalSearchParams } from "expo-router"

import { Ammo } from "lib/objects/data/ammo/ammo.types"

import AddElement from "components/AddElement"
import { DrawerParams } from "components/Drawer/Drawer.params"
import DrawerPage from "components/DrawerPage"
import Section from "components/Section"
import Spacer from "components/Spacer"
import routes from "constants/routes"
import { useInventory } from "contexts/InventoryContext"
import AmmoRow, { ListHeader } from "screens/InventoryTabs/AmmoScreen/AmmoRow"
import { SearchParams } from "screens/ScreenParams"

import { AmmoSort, AmmoSortableKey } from "./AmmoScreen.types"

function AmmoScreen() {
  const localParams = useLocalSearchParams<SearchParams<DrawerParams>>()
  const [selectedAmmo, setSelectedAmmo] = useState<Ammo | null>(null)
  const [sort, setSort] = useState<AmmoSort>({ type: "name", isAsc: false })

  const { ammo } = useInventory()

  const onPressAdd = () =>
    router.push({
      pathname: routes.modal.updateObjects,
      params: {
        squadId: localParams.squadId,
        charId: localParams.charId,
        initCategory: "ammo"
      }
    })

  const onPressHeader = (type: AmmoSortableKey) => {
    setSort(prev => ({ type, isAsc: prev.type === type ? !prev.isAsc : true }))
  }

  const sortedAmmo = useMemo(() => {
    const sortFn = (a: Ammo, b: Ammo) => {
      if (sort.type === "name") return b.data.label.localeCompare(a.data.label)
      if (sort.type === "count") return a.amount - b.amount
      return 0
    }
    const sorted = ammo.sort(sortFn)
    return sort.isAsc ? sorted : sorted.reverse()
  }, [ammo, sort])

  return (
    <DrawerPage>
      <Section style={{ flex: 1 }}>
        <FlatList
          data={sortedAmmo}
          keyExtractor={item => item.id}
          ListHeaderComponent={<ListHeader onPress={onPressHeader} sortState={sort} />}
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
      <Spacer x={10} />
      <View style={{ width: 130 }}>
        <Section style={{ width: 130, flex: 1 }}>
          <Spacer fullspace />
        </Section>
        <Section style={{ width: 130 }}>
          <AddElement title="AJOUTER" onPressAdd={onPressAdd} />
        </Section>
      </View>
    </DrawerPage>
  )
}

export default memo(AmmoScreen)
