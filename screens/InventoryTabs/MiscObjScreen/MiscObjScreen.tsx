import React, { useMemo, useState } from "react"
import { FlatList, View } from "react-native"

import { router, useLocalSearchParams } from "expo-router"

import useCases from "lib/common/use-cases"
import { MiscObject } from "lib/objects/data/misc-objects/misc-objects-types"

import AddElement from "components/AddElement"
import { DrawerParams } from "components/Drawer/Drawer.params"
import DrawerPage from "components/DrawerPage"
import Section from "components/Section"
import Spacer from "components/Spacer"
import routes from "constants/routes"
import { useInventory } from "contexts/InventoryContext"
import MiscObjDetails from "screens/InventoryTabs/MiscObjScreen/MiscObjDetails"
import MiscObjRow, { ListHeader } from "screens/InventoryTabs/MiscObjScreen/MiscObjRow"
import { SearchParams } from "screens/ScreenParams"

export default function MiscObjScreen() {
  const { squadId, charId } = useLocalSearchParams() as SearchParams<DrawerParams>
  const [selectedItem, setSelectedItem] = useState<MiscObject | null>(null)
  const [isAscSort, setIsAscSort] = useState(true)

  const { groupedMiscObjects } = useInventory()

  const onPressAdd = () =>
    router.push({
      pathname: routes.modal.updateObjects,
      params: { squadId, charId, initCategory: "miscObjects" }
    })

  const onPressHeader = () => setIsAscSort(prev => !prev)

  const sortedMiscObjects = useMemo(() => {
    const sortFn = (a: MiscObject, b: MiscObject) => {
      if (isAscSort) return a.data.label.localeCompare(b.data.label)
      return b.data.label.localeCompare(a.data.label)
    }
    const sorted = groupedMiscObjects.sort(sortFn)
    return sorted
  }, [groupedMiscObjects, isAscSort])

  return (
    <DrawerPage>
      <Section style={{ flex: 1 }}>
        <FlatList
          data={sortedMiscObjects}
          keyExtractor={item => item.id}
          ListHeaderComponent={<ListHeader onPress={onPressHeader} isAsc={isAscSort} />}
          stickyHeaderIndices={[0]}
          renderItem={({ item }) => (
            <MiscObjRow
              objId={item.id}
              count={item.count}
              isSelected={item.id === selectedItem?.id}
              onPress={() => setSelectedItem(prev => (prev?.id === item.id ? null : item))}
              onPressDelete={() => useCases.inventory.throw(charId, item)}
            />
          )}
        />
      </Section>
      <Spacer x={10} />
      <View style={{ width: 180 }}>
        <Section style={{ width: 180, flex: 1 }}>
          <MiscObjDetails miscObj={selectedItem} />
        </Section>
        <Section style={{ width: 180 }}>
          <AddElement title="AJOUTER" onPressAdd={onPressAdd} />
        </Section>
      </View>
    </DrawerPage>
  )
}
