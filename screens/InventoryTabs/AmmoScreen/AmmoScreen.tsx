import React, { memo, useMemo, useState } from "react"
import { View } from "react-native"

import { router, useLocalSearchParams } from "expo-router"

import { useBarterActions } from "lib/objects/barter-store"
import { Ammo } from "lib/objects/data/ammo/ammo.types"

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
import AmmoRow from "screens/InventoryTabs/AmmoScreen/AmmoRow"
import { SearchParams } from "screens/ScreenParams"
import layout from "styles/layout"

import { AmmoSort, AmmoSortableKey } from "./AmmoScreen.types"

const getTitle = (cb: (str: AmmoSortableKey) => void): ComposedTitleProps => [
  { title: "munition", onPress: () => cb("name"), containerStyle: { flex: 1 } },
  { title: "quantité", onPress: () => cb("count"), containerStyle: { width: 90 } },
  { title: "", containerStyle: { width: 40 }, lineStyle: { minWidth: 0 }, spacerWidth: 0 }
]

function AmmoScreen() {
  const localParams = useLocalSearchParams<SearchParams<DrawerParams>>()
  const [selectedAmmo, setSelectedAmmo] = useState<Ammo | null>(null)
  const [sort, setSort] = useState<AmmoSort>({ type: "name", isAsc: false })

  const { ammo } = useInventory()

  const barterActions = useBarterActions()

  const onPressAdd = () => {
    barterActions.selectCategory("ammo")
    router.push({
      pathname: routes.modal.barter,
      params: {
        squadId: localParams.squadId,
        charId: localParams.charId
      }
    })
  }

  const onPressHeader = (type: AmmoSortableKey) => {
    setSort(prev => ({ type, isAsc: prev.type === type ? !prev.isAsc : true }))
  }
  const title = getTitle(onPressHeader)

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
      <ScrollSection style={{ flex: 1 }} title={title}>
        <List
          data={sortedAmmo}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <AmmoRow
              ammo={item}
              isSelected={selectedAmmo?.id === item.id}
              onPress={() => setSelectedAmmo(prev => (prev?.id === item.id ? null : item))}
            />
          )}
        />
      </ScrollSection>

      <Spacer x={layout.globalPadding} />

      <View style={{ width: 130 }}>
        <Section style={{ flex: 1 }}>
          <Spacer fullspace />
        </Section>

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

export default memo(AmmoScreen)
