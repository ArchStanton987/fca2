import React, { useState } from "react"
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

export default function AmmoScreen() {
  const localParams = useLocalSearchParams<SearchParams<DrawerParams>>()
  const [selectedAmmo, setSelectedAmmo] = useState<Ammo | null>(null)

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

  return (
    <DrawerPage>
      <Section style={{ flex: 1 }}>
        <FlatList
          data={ammo}
          keyExtractor={item => item.id}
          ListHeaderComponent={ListHeader}
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
