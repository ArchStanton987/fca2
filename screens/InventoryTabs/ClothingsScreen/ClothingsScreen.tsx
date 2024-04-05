import React, { useState } from "react"
import { FlatList, View } from "react-native"

import { router, useLocalSearchParams } from "expo-router"

import { Clothing } from "lib/objects/data/clothings/clothings.types"

import AddElement from "components/AddElement"
import { DrawerParams } from "components/Drawer/Drawer.params"
import DrawerPage from "components/DrawerPage"
import Section from "components/Section"
import Spacer from "components/Spacer"
import routes from "constants/routes"
import { useInventory } from "contexts/InventoryContext"
import ClothingRow, { ListHeader } from "screens/InventoryTabs/ClothingsScreen/ClothingRow"
import ClothingsDetails from "screens/InventoryTabs/ClothingsScreen/ClothingsDetails"
import { SearchParams } from "screens/ScreenParams"

export default function ClothingsScreen() {
  const localParams = useLocalSearchParams<SearchParams<DrawerParams>>()
  const [selectedCloth, setSelectedCloth] = useState<Clothing | null>(null)

  const { clothings } = useInventory()

  const onPressAdd = () =>
    router.push({
      pathname: routes.modal.updateObjects,
      params: {
        squadId: localParams.squadId,
        charId: localParams.charId,
        initCategory: "clothings"
      }
    })

  return (
    <DrawerPage>
      <Section style={{ flex: 1 }}>
        <FlatList
          data={clothings}
          keyExtractor={item => item.dbKey}
          ListHeaderComponent={ListHeader}
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
        <Section style={{ width: 120 }}>
          <ClothingsDetails charClothing={selectedCloth} />
        </Section>
        <Section style={{ width: 120 }}>
          <AddElement title="AJOUTER" onPressAdd={onPressAdd} />
        </Section>
      </View>
    </DrawerPage>
  )
}
