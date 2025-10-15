import { useMemo, useState } from "react"
import { TouchableOpacity, TouchableOpacityProps, View } from "react-native"

import { router, useLocalSearchParams } from "expo-router"

import { useCaps } from "lib/inventory/use-sub-inv-cat"
import { AmmoType } from "lib/objects/data/ammo/ammo.types"
import { DbInventory, ItemCategory } from "lib/objects/data/objects.types"

import AmountSelector from "components/AmountSelector"
import List from "components/List"
import ModalCta from "components/ModalCta/ModalCta"
import ScrollableSection from "components/ScrollableSection"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import TxtInput from "components/TxtInput"
import ViewSection from "components/ViewSection"
import MinusIcon from "components/icons/MinusIcon"
import PlusIcon from "components/icons/PlusIcon"
import ModalBody from "components/wrappers/ModalBody"
import routes from "constants/routes"
import { useUpdateObjects } from "contexts/UpdateObjectsContext"
import { useCollectiblesData } from "providers/AdditionalElementsProvider"
import { getCategoriesMap } from "screens/MainTabs/modals/UpdateObjectsModal/UpdateObjectsModal.utils"
import { toLocalParams } from "screens/ScreenParams"

import styles from "./UpdateObjectsModal.styles"

type SelectedItem = { id: string; label: string; inInventory: number } | null

type ListItemRowProps = TouchableOpacityProps & {
  label: string
  inv: string | number
  mod: string | number
  prev: string | number
  isSelected?: boolean
}

function ListItemRow({ label, inv, mod, prev, isSelected, ...rest }: ListItemRowProps) {
  return (
    <TouchableOpacity
      style={[styles.listItemContainer, isSelected && styles.listItemContainerSelected]}
      {...rest}
    >
      <Txt style={[styles.listItem, styles.listItemLabel]} numberOfLines={1}>
        {label}
      </Txt>
      <Txt style={[styles.listItem, styles.listItemInfo]}>{inv}</Txt>
      <Txt style={[styles.listItem, styles.listItemInfo]}>{mod}</Txt>
      <Txt style={[styles.listItem, styles.listItemInfo]}>{prev}</Txt>
    </TouchableOpacity>
  )
}

function ListItemHeader() {
  return <ListItemRow label="Obj" inv="Inv" mod="Mod" prev="Prev" />
}

export default function UpdateObjectsModal() {
  const { charId, squadId, initCategory } = useLocalSearchParams<{
    charId: string
    squadId: string
    initCategory?: ItemCategory
  }>()
  const [selectedCat, setSelectedCat] = useState<ItemCategory>(initCategory ?? "weapons")
  const [selectedItem, setSelectedItem] = useState<SelectedItem>(null)
  const [selectedAmount, setSelectedAmount] = useState<number>(1)
  const [searchInput, setSearchInput] = useState("")

  const caps = useCaps(charId)

  const { state, dispatch } = useUpdateObjects()

  const allCollectibles = useCollectiblesData()
  const categoriesMap = getCategoriesMap(allCollectibles)
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

  const onPressNext = () => {
    const params = toLocalParams({ squadId, charId })
    router.push({ pathname: routes.modal.updateObjectsConfirmation, params })
  }

  const onPressCancel = () => {
    dispatch({ type: "reset" })
    router.back()
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
    <ModalBody>
      <View style={styles.row}>
        <ScrollableSection title="CATEGORIES" style={styles.categoriesSection}>
          {categories.map(({ id, label }) => (
            <TouchableOpacity
              key={id}
              style={[
                styles.listItemContainer,
                selectedCat === id && styles.listItemContainerSelected
              ]}
              onPress={() => onPressCategory(id as keyof DbInventory)}
            >
              <Txt style={styles.listItem}>{label}</Txt>
              <Spacer y={5} />
            </TouchableOpacity>
          ))}
        </ScrollableSection>
        <Spacer x={15} />
        <ScrollableSection title="LISTE" style={styles.listSection}>
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
        </ScrollableSection>
        <Spacer x={15} />
        <View>
          {hasSearch && (
            <ViewSection title="RECHERCHE" style={styles.searchSection}>
              <TxtInput value={searchInput} onChangeText={e => setSearchInput(e)} />
            </ViewSection>
          )}
          <ViewSection title="AJOUTER" style={styles.addSection}>
            <View style={{ flex: 1, justifyContent: "space-evenly" }}>
              <List
                data={categoriesMap[selectedCat].selectors}
                keyExtractor={item => item.toString()}
                renderItem={({ item }) => (
                  <AmountSelector
                    value={item}
                    isSelected={selectedAmount === item}
                    onPress={() => setSelectedAmount(item)}
                  />
                )}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-evenly"
                }}
              />
              <View style={styles.iconsContainer}>
                <MinusIcon size={62} onPress={() => onPressMod("minus")} />
                <PlusIcon size={62} onPress={() => onPressMod("plus")} />
              </View>
            </View>
          </ViewSection>
        </View>
      </View>
      <ModalCta onPressConfirm={onPressNext} onPressCancel={onPressCancel} />
    </ModalBody>
  )
}
