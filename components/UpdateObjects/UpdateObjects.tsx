import { useMemo, useState } from "react"

import { useSegments } from "expo-router"

import { AmmoType } from "lib/objects/data/ammo/ammo.types"
import { DbInventory } from "lib/objects/data/objects.types"

import AmountSelector from "components/AmountSelector"
import Col from "components/Col"
import List from "components/List"
import ListItemSelectable from "components/ListItemSelectable"
import Row from "components/Row"
import Section from "components/Section"
import ScrollSection from "components/Section/ScrollSection"
import Spacer from "components/Spacer"
import TxtInput from "components/TxtInput"
import MinusIcon from "components/icons/MinusIcon"
import PlusIcon from "components/icons/PlusIcon"
import { useInventory } from "contexts/InventoryContext"
import { useUpdateObjects } from "contexts/UpdateObjectsContext"
import useCreatedElements from "hooks/context/useCreatedElements"
import GoBackButton from "screens/CombatScreen/slides/GoBackButton"
import PlayButton from "screens/CombatScreen/slides/PlayButton"
import { getCategoriesMap } from "screens/MainTabs/modals/UpdateObjectsModal/UpdateObjectsModal.utils"
import layout from "styles/layout"

import ListItemHeader from "./ListItemHeader"
import ListItemRow from "./ListItemRow"
import styles from "./UpdateObjects.styles"

type SelectedItem = { id: string; label: string; inInventory: number } | null

type UpdateObjectsProps = {
  onPressNext?: () => void
  onPressCancel?: () => void
  initCategory?: keyof DbInventory
}

export default function UpdateObjects({
  onPressNext,
  onPressCancel,
  initCategory
}: UpdateObjectsProps) {
  const segments = useSegments()
  const isModal = segments.includes("modal")

  const [selectedCat, setSelectedCat] = useState<keyof DbInventory>(initCategory ?? "weapons")
  const [selectedItem, setSelectedItem] = useState<SelectedItem>(null)
  const [selectedAmount, setSelectedAmount] = useState<number>(1)
  const [searchInput, setSearchInput] = useState("")

  const inventory = useInventory()
  const { caps } = inventory

  const { state, dispatch } = useUpdateObjects()

  const createdElements = useCreatedElements()
  const categoriesMap = getCategoriesMap(createdElements)
  const categories = Object.values(categoriesMap)

  const onPressMod = (modType: "minus" | "plus") => {
    if (selectedItem === null) return
    const count = modType === "minus" ? -selectedAmount : selectedAmount
    const { inInventory, label, id } = selectedItem
    const payload = { category: selectedCat, id, count, label, inInventory }
    dispatch({ type: "modObject", payload })
  }

  const onPressCategory = (category: keyof DbInventory) => {
    if (category === "caps") {
      const { id, label } = categoriesMap.caps
      setSelectedItem({ id, label, inInventory: caps })
    }
    setSelectedCat(category)
  }

  const onCancel = () => {
    if (onPressCancel) {
      onPressCancel()
    }
    dispatch({ type: "reset" })
  }

  const onNext = () => {
    if (onPressNext) {
      onPressNext()
    }

    dispatch({ type: "reset" })
  }

  const getInInv = (id: string) => {
    if (selectedCat === "caps") return caps
    if (selectedCat === "ammo") return inventory.ammoRecord[id as AmmoType] || 0
    return inventory[selectedCat].filter(el => el.id === id).length || 0
  }

  const hasSearch = categoriesMap[selectedCat]?.hasSearch

  const objectsList = useMemo(() => {
    if (selectedCat === null) return []
    const { data } = categoriesMap[selectedCat]
    const list = Object.values(data).map(({ id, label }) => ({ id, label }))
    if (!categoriesMap[selectedCat]?.hasSearch) return list
    return searchInput.length > 2
      ? list.filter(el => {
          if (selectedCat === "weapons" && el.id === "unarmed") return false
          return el.label.toLowerCase().includes(searchInput.toLowerCase())
        })
      : []
  }, [selectedCat, searchInput, categoriesMap])

  return (
    <>
      <ScrollSection title="categories">
        <List
          data={categories}
          keyExtractor={e => e.id}
          renderItem={({ item }) => (
            <ListItemSelectable
              label={item.label}
              onPress={() => onPressCategory(item.id as keyof DbInventory)}
              isSelected={selectedCat === item.id}
            />
          )}
        />
      </ScrollSection>

      <Spacer x={layout.globalPadding} />

      <ScrollSection title="liste" style={{ flex: 1 }}>
        <List
          data={objectsList}
          keyExtractor={item => item.id}
          ListHeaderComponent={ListItemHeader}
          renderItem={({ item }) => {
            const count = state[selectedCat][item.id]?.count || 0
            const inInventory = getInInv(item.id)
            return (
              <ListItemRow
                label={item.label}
                inv={inInventory}
                mod={count}
                prev={inInventory + count}
                isSelected={selectedItem?.id === item.id}
                onPress={() => setSelectedItem({ ...item, inInventory })}
              />
            )
          }}
        />
      </ScrollSection>

      <Spacer x={layout.globalPadding} />

      <Col style={{ width: 180 }}>
        {hasSearch ? (
          <>
            <Section title="recherche">
              <TxtInput onChangeText={e => setSearchInput(e)} />
            </Section>
            <Spacer y={5} />
          </>
        ) : null}

        <Section style={{ flex: 1 }} contentContainerStyle={styles.selectorsSection}>
          <List
            horizontal
            style={styles.amountContainer}
            data={categoriesMap[selectedCat].selectors}
            keyExtractor={item => item.toString()}
            renderItem={({ item }) => (
              <AmountSelector
                value={item}
                isSelected={selectedAmount === item}
                onPress={() => setSelectedAmount(item)}
              />
            )}
          />
          <Row style={styles.buttonsSection}>
            <MinusIcon size={45} onPress={() => onPressMod("minus")} />
            <PlusIcon size={45} onPress={() => onPressMod("plus")} />
          </Row>
        </Section>

        {!isModal ? (
          <>
            <Spacer y={5} />
            <Section contentContainerStyle={styles.centeredSection}>
              <GoBackButton size={36} onPress={onCancel} />
              <PlayButton onPress={onNext} />
            </Section>
          </>
        ) : null}
      </Col>
    </>
  )
}
