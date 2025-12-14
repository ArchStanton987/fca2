import React, { useMemo, useState } from "react"

import { router, useLocalSearchParams } from "expo-router"

import { useItems } from "lib/inventory/use-sub-inv-cat"
import { useBarterActions } from "lib/objects/barter-store"
import Clothing from "lib/objects/data/clothings/Clothing"
import ClothingRow from "lib/objects/data/clothings/ui/ClothingRow"
import ClothingsDetails from "lib/objects/data/clothings/ui/ClothingsDetails"

import Col from "components/Col"
import DrawerPage from "components/DrawerPage"
import List from "components/List"
import Section from "components/Section"
import ScrollSection from "components/Section/ScrollSection"
import { ComposedTitleProps } from "components/Section/Section.types"
import Spacer from "components/Spacer"
import PlusIcon from "components/icons/PlusIcon"
import layout from "styles/layout"
import { filterUnique } from "utils/array-utils"

type ClothingSortableKey =
  | "dbKey"
  | "equiped"
  | "name"
  | "physRes"
  | "lasRes"
  | "fireRes"
  | "plaRes"
  | "malus"
type ClothingSort = { type: ClothingSortableKey; isAsc: boolean }

const damageProp = { containerStyle: { width: 37 }, lineStyle: { minWidth: 0 }, spacerWidth: 5 }

const getTitle = (cb: (str: ClothingSortableKey) => void): ComposedTitleProps => [
  {
    title: "equ",
    onPress: () => cb("equiped"),
    containerStyle: { width: 45 },
    lineStyle: { minWidth: 5 },
    titlePosition: "left",
    spacerWidth: 5
  },
  { title: "objet", onPress: () => cb("name"), containerStyle: { flex: 1 } },
  { title: "phy", onPress: () => cb("physRes"), ...damageProp },
  { title: "las", onPress: () => cb("lasRes"), ...damageProp },
  { title: "feu", onPress: () => cb("fireRes"), ...damageProp },
  { title: "pla", onPress: () => cb("plaRes"), ...damageProp },
  { title: "mal", onPress: () => cb("malus"), ...damageProp },
  { title: "", containerStyle: { width: 32 }, lineStyle: { minWidth: 0 }, spacerWidth: 0 }
]

export default function ClothingsScreen() {
  const { charId, squadId } = useLocalSearchParams<{ charId: string; squadId: string }>()
  const [selectedCloth, setSelectedCloth] = useState<string | null>(null)
  const [sort, setSort] = useState<ClothingSort>({ type: "dbKey", isAsc: false })

  const { data: allClothings } = useItems(charId, i =>
    Object.values(i).filter(item => item.category === "clothings")
  )
  const clothings = filterUnique("id", allClothings)

  const barterActions = useBarterActions()

  const onPressAdd = () => {
    barterActions.selectCategory("clothings")
    router.push({
      pathname: "/squad/[squadId]/character/[charId]/barter",
      params: { squadId, charId }
    })
  }

  const onPressClothingHeader = (type: ClothingSortableKey) => {
    setSort(prev => ({ type, isAsc: prev.type === type ? !prev.isAsc : true }))
  }
  const title = getTitle(onPressClothingHeader)

  const sortedClothings = useMemo(() => {
    const sortFn = (a: Clothing, b: Clothing) => {
      if (sort.type === "dbKey") return b.dbKey.localeCompare(a.dbKey)
      if (sort.type === "name") return b.data.label.localeCompare(a.data.label)
      if (sort.type === "physRes")
        return b.data.physicalDamageResist > a.data.physicalDamageResist ? -1 : 1
      if (sort.type === "lasRes")
        return b.data.laserDamageResist > a.data.laserDamageResist ? -1 : 1
      if (sort.type === "fireRes") return b.data.fireDamageResist > a.data.fireDamageResist ? -1 : 1
      if (sort.type === "plaRes")
        return b.data.plasmaDamageResist > a.data.plasmaDamageResist ? -1 : 1
      if (sort.type === "malus") return b.data.malus > a.data.malus ? -1 : 1
      return 0
    }
    const sorted = clothings.sort(sortFn)
    return sort.isAsc ? sorted : sorted.reverse()
  }, [clothings, sort])

  return (
    <DrawerPage>
      <ScrollSection style={{ flex: 1 }} contentContainerStyle={{ paddingRight: 0 }} title={title}>
        <List
          data={sortedClothings}
          keyExtractor={item => item.dbKey}
          renderItem={({ item }) => (
            <ClothingRow
              charId={charId}
              itemKey={item.dbKey}
              isSelected={item.dbKey === selectedCloth}
              onPress={() => setSelectedCloth(item.dbKey)}
            />
          )}
        />
      </ScrollSection>

      <Spacer x={layout.globalPadding} />

      <Col style={{ width: 130 }}>
        <ScrollSection style={{ flex: 1 }} title="détails">
          <ClothingsDetails charId={charId} itemKey={selectedCloth} />
        </ScrollSection>

        <Spacer y={layout.globalPadding} />

        <Section
          title="ajouter"
          contentContainerStyle={{ alignItems: "center", justifyContent: "center" }}
        >
          <PlusIcon onPress={onPressAdd} />
        </Section>
      </Col>
    </DrawerPage>
  )
}
