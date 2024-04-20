import React, { useState } from "react"
import { FlatList, View } from "react-native"

import { router, useLocalSearchParams } from "expo-router"

import { inventoryController } from "lib/common/controllers"
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
import { filterUnique } from "utils/array-utils"

export default function MiscObjScreen() {
  const { squadId, charId } = useLocalSearchParams() as SearchParams<DrawerParams>
  const [selectedItem, setSelectedItem] = useState<MiscObject | null>(null)

  const { miscObjects } = useInventory()

  // TODO: group in inventory class
  const groupedObjects = filterUnique(
    "id",
    miscObjects.map((consumable, _, currArr) => {
      const count = currArr.filter(el => el.id === consumable.id).length
      return { ...consumable, count }
    })
  )

  const onPressAdd = () =>
    router.push({
      pathname: routes.modal.updateObjects,
      params: { squadId, charId, initCategory: "miscObjects" }
    })

  return (
    <DrawerPage>
      <Section style={{ flex: 1 }}>
        <FlatList
          data={groupedObjects}
          keyExtractor={item => item.id}
          ListHeaderComponent={ListHeader}
          stickyHeaderIndices={[0]}
          renderItem={({ item }) => (
            <MiscObjRow
              objId={item.id}
              count={item.count}
              isSelected={item.id === selectedItem?.id}
              onPress={() => setSelectedItem(prev => (prev?.id === item.id ? null : item))}
              onPressDelete={() => inventoryController.remove(charId, item)}
            />
          )}
        />
      </Section>
      <Spacer x={10} />
      <View style={{ width: 180 }}>
        <Section style={{ width: 180, flexGrow: 1 }}>
          <MiscObjDetails miscObj={selectedItem} />
        </Section>
        <Section style={{ width: 180 }}>
          <AddElement title="AJOUTER" onPressAdd={onPressAdd} />
        </Section>
      </View>
    </DrawerPage>
  )
}
