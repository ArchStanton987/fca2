import { useMemo, useState } from "react"
import { View } from "react-native"

import { router, useLocalSearchParams } from "expo-router"

import { useAmmo } from "lib/inventory/use-sub-inv-cat"
import { useBarterActions } from "lib/objects/barter-store"
import ammoMap from "lib/objects/data/ammo/ammo"
import { AmmoType } from "lib/objects/data/ammo/ammo.types"
import AmmoRow from "lib/objects/data/ammo/ui/AmmoRow"

import DrawerPage from "components/DrawerPage"
import List from "components/List"
import Section from "components/Section"
import ScrollSection from "components/Section/ScrollSection"
import { ComposedTitleProps } from "components/Section/Section.types"
import Spacer from "components/Spacer"
import PlusIcon from "components/icons/PlusIcon"
import layout from "styles/layout"

type AmmoSortableKey = "name" | "count"
type AmmoSort = { type: AmmoSortableKey; isAsc: boolean }
type AmmoEntry = { id: AmmoType; count: number }

const getTitle = (cb: (str: AmmoSortableKey) => void): ComposedTitleProps => [
  { title: "munition", onPress: () => cb("name"), containerStyle: { flex: 1 } },
  { title: "quantité", onPress: () => cb("count"), containerStyle: { width: 90 } },
  { title: "", containerStyle: { width: 40 }, lineStyle: { minWidth: 0 }, spacerWidth: 0 }
]

export default function AmmoScreen() {
  const { charId, squadId } = useLocalSearchParams<{ charId: string; squadId: string }>()
  const [selectedAmmo, setSelectedAmmo] = useState<AmmoType | null>(null)
  const [sort, setSort] = useState<AmmoSort>({ type: "name", isAsc: false })

  const { data: ammo } = useAmmo(charId)

  const barterActions = useBarterActions()

  const onPressAdd = () => {
    barterActions.selectCategory("ammo")
    router.push({
      pathname: "/squad/[squadId]/character/[charId]/barter",
      params: { squadId, charId }
    })
  }

  const onPressHeader = (type: AmmoSortableKey) => {
    setSort(prev => ({ type, isAsc: prev.type === type ? !prev.isAsc : true }))
  }
  const title = getTitle(onPressHeader)

  const sortedAmmo = useMemo(() => {
    const ammoArray = Object.entries(ammo)
      .map(([id, count]) => ({ id: id as AmmoType, count }))
      .filter(({ count }) => count > 0)
    const sortFn = (a: AmmoEntry, b: AmmoEntry) => {
      if (sort.type === "name") return ammoMap[b.id].label.localeCompare(ammoMap[a.id].label)
      if (sort.type === "count") return a.count - b.count
      return 0
    }
    const sorted = ammoArray.sort(sortFn)
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
              ammoType={item.id}
              count={item.count}
              isSelected={selectedAmmo === item.id}
              onPress={() => setSelectedAmmo(prev => (prev === item.id ? null : item.id))}
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
