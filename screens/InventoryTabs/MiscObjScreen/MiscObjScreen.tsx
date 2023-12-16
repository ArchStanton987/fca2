import React, { useState } from "react"
import { FlatList } from "react-native"

import { useLocalSearchParams } from "expo-router"

import { DrawerParams } from "components/Drawer/Drawer.params"
import DrawerPage from "components/DrawerPage"
import Section from "components/Section"
import Spacer from "components/Spacer"
import { useGetInventory } from "hooks/db/useGetInventory"
import { MiscObjectId } from "models/objects/misc/misc-object-types"
import miscObjectsMap from "models/objects/misc/misc-objects"
import MiscObjDetails from "screens/InventoryTabs/MiscObjScreen/MiscObjDetails"
import MiscObjRow, { ListHeader } from "screens/InventoryTabs/MiscObjScreen/MiscObjRow"
import { SearchParams } from "screens/ScreenParams"
import { filterUnique } from "utils/array-utils"

export default function MiscObjScreen() {
  const [selectedId, setSelectedId] = useState<MiscObjectId | null>(null)
  const { charId } = useLocalSearchParams() as SearchParams<DrawerParams>
  const { objects } = useGetInventory(charId)

  const selectedObj = selectedId ? miscObjectsMap[selectedId] : undefined

  const groupedObjects = filterUnique(
    "id",
    objects.map((consumable, _, currArr) => {
      const count = currArr.filter(el => el.id === consumable.id).length
      return { ...consumable, count }
    })
  )

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
              isSelected={selectedId === item.id}
              onPress={() => setSelectedId(prev => (prev === item.id ? null : item.id))}
            />
          )}
        />
      </Section>
      <Spacer x={10} />
      <Section style={{ width: 180 }}>
        <MiscObjDetails miscObj={selectedObj} />
      </Section>
    </DrawerPage>
  )
}
