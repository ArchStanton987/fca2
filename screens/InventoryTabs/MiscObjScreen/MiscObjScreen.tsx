import React, { memo, useMemo, useState } from "react"
import { View } from "react-native"

import { router, useLocalSearchParams } from "expo-router"

import useCases from "lib/common/use-cases"
import { MiscObject } from "lib/objects/data/misc-objects/misc-objects-types"

import { DrawerParams } from "components/Drawer/Drawer.params"
import DrawerPage from "components/DrawerPage"
import List from "components/List"
import Section from "components/Section"
import ScrollSection from "components/Section/ScrollSection"
import { ComposedTitleProps } from "components/Section/Section.types"
import Spacer from "components/Spacer"
import PlusIcon from "components/icons/PlusIcon"
import routes from "constants/routes"
import { useInventory } from "contexts/InventoryContext"
import MiscObjDetails from "screens/InventoryTabs/MiscObjScreen/MiscObjDetails"
import MiscObjRow from "screens/InventoryTabs/MiscObjScreen/MiscObjRow"
import { SearchParams } from "screens/ScreenParams"
import layout from "styles/layout"

const getTitle = (cb: (str: string) => void): ComposedTitleProps => [
  { title: "objet", onPress: () => cb("label"), containerStyle: { flex: 1 } }
]

function MiscObjScreen() {
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
  const title = getTitle(onPressHeader)

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
      <ScrollSection style={{ flex: 1 }} title={title}>
        <List
          data={sortedMiscObjects}
          keyExtractor={item => item.id}
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
      </ScrollSection>
      <Spacer x={layout.globalPadding} />
      <View style={{ width: 180 }}>
        <ScrollSection style={{ flex: 1 }} title="description">
          <MiscObjDetails miscObj={selectedItem} />
        </ScrollSection>

        <Spacer y={layout.globalPadding} />

        <Section title="ajouter">
          <View style={{ alignItems: "center" }}>
            <PlusIcon onPress={onPressAdd} />
          </View>
        </Section>
      </View>
    </DrawerPage>
  )
}

export default memo(MiscObjScreen)
