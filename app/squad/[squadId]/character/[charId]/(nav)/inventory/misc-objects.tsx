import React, { useMemo, useState } from "react"
import { View } from "react-native"

import { router, useLocalSearchParams } from "expo-router"

import { useCurrCharId } from "lib/character/character-store"
import { useItems } from "lib/inventory/use-sub-inv-cat"
import { useBarterActions } from "lib/objects/barter-store"
import MiscObject from "lib/objects/data/misc-objects/MiscObject"
import MiscObjDetails from "lib/objects/data/misc-objects/ui/MiscObjDetails"
import MiscObjRow from "lib/objects/data/misc-objects/ui/MiscObjRow"

import DrawerPage from "components/DrawerPage"
import List from "components/List"
import Section from "components/Section"
import ScrollSection from "components/Section/ScrollSection"
import { ComposedTitleProps } from "components/Section/Section.types"
import Spacer from "components/Spacer"
import PlusIcon from "components/icons/PlusIcon"
import { useGetUseCases } from "providers/UseCasesProvider"
import layout from "styles/layout"
import { filterUnique } from "utils/array-utils"

const getTitle = (cb: (str: string) => void): ComposedTitleProps => [
  { title: "objet", onPress: () => cb("label"), containerStyle: { flex: 1 } }
]

export default function MiscObjScreen() {
  const { squadId } = useLocalSearchParams<{ squadId: string }>()
  const charId = useCurrCharId()
  const useCases = useGetUseCases()
  const [selectedItem, setSelectedItem] = useState<MiscObject | null>(null)
  const [isAscSort, setIsAscSort] = useState(true)

  const barterActions = useBarterActions()

  const { data: allMiscObjects } = useItems(charId, allMisc =>
    Object.values(allMisc).filter(el => el.category === "misc")
  )
  const miscObjects = filterUnique("id", allMiscObjects)

  const onPressAdd = () => {
    barterActions.selectCategory("miscObjects")
    router.push({
      pathname: "/squad/[squadId]/character/[charId]/barter",
      params: { squadId, charId }
    })
  }

  const onPressHeader = () => setIsAscSort(prev => !prev)
  const title = getTitle(onPressHeader)

  const sortedMiscObjects = useMemo(() => {
    const sortFn = (a: MiscObject, b: MiscObject) => {
      if (isAscSort) return a.data.label.localeCompare(b.data.label)
      return b.data.label.localeCompare(a.data.label)
    }
    const sorted = miscObjects.sort(sortFn)
    return sorted
  }, [miscObjects, isAscSort])

  return (
    <DrawerPage>
      <ScrollSection style={{ flex: 1 }} title={title}>
        <List
          data={sortedMiscObjects}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <MiscObjRow
              objDbKey={item.dbKey}
              isSelected={item.id === selectedItem?.id}
              onPress={() => setSelectedItem(prev => (prev?.id === item.id ? null : item))}
              onPressDelete={() => useCases.inventory.drop({ charId, item })}
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
