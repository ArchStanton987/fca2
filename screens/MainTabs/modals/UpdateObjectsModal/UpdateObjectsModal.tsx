import { useMemo, useState } from "react"
import { TouchableOpacity, View } from "react-native"

import { router, useLocalSearchParams } from "expo-router"

import ammoMap from "lib/objects/data/ammo/ammo"
import clothingsMap from "lib/objects/data/clothings/clothings"
import consumablesMap from "lib/objects/data/consumables/consumables"
import miscObjectsMap from "lib/objects/data/misc-objects/misc-objects"
import weaponsMap from "lib/objects/data/weapons/weapons"

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
import { useInventory } from "contexts/InventoryContext"
import { useUpdateObjects } from "contexts/UpdateObjectsContext"
import { UpdateObjectsModalParams } from "screens/MainTabs/modals/UpdateObjectsModal/UpdateObjectsModal.params"
import ScreenParams, { SearchParams } from "screens/ScreenParams"

import styles from "./UpdateObjectsModal.styles"

export const categoriesMap = {
  weapons: {
    id: "weapons",
    label: "Armes",
    selectors: [1, 5],
    hasSearch: true,
    data: weaponsMap
  },
  clothings: {
    id: "clothings",
    label: "Armures",
    selectors: [1, 5],
    hasSearch: false,
    data: clothingsMap
  },
  consumables: {
    id: "consumables",
    label: "Consommables",
    selectors: [1, 5, 20],
    hasSearch: false,
    data: consumablesMap
  },
  miscObjects: {
    id: "miscObjects",
    label: "Objets",
    selectors: [1, 5, 20, 100],
    hasSearch: true,
    data: miscObjectsMap
  },
  ammo: {
    id: "ammo",
    label: "Munitions",
    selectors: [1, 5, 20, 100],
    hasSearch: false,
    data: ammoMap
  },
  caps: {
    id: "caps",
    label: "Caps",
    selectors: [1, 5, 20, 100, 500],
    hasSearch: false,
    data: { caps: { id: "caps", label: "Capsule(s)" } }
  }
}

type SelectedCat = keyof typeof categoriesMap
type SelectedItem = { id: string; label: string; inInventory: number } | null

const categories = Object.values(categoriesMap)

export default function UpdateObjectsModal() {
  const localParams = useLocalSearchParams() as SearchParams<UpdateObjectsModalParams>
  const { initCategory = "weapons" } = ScreenParams.fromLocalParams(localParams)
  const [selectedCat, setSelectedCat] = useState<SelectedCat>(initCategory)
  const [selectedItem, setSelectedItem] = useState<SelectedItem>(null)
  const [selectedAmount, setSelectedAmount] = useState<number>(1)
  const [searchInput, setSearchInput] = useState("")

  const inventory = useInventory()
  const { caps } = inventory

  const { state, dispatch } = useUpdateObjects()

  // TODO: allow to buy / sell products

  const onPressMod = (modType: "minus" | "plus") => {
    if (selectedItem === null) return
    const count = modType === "minus" ? -selectedAmount : selectedAmount
    const payload = {
      category: selectedCat,
      id: selectedItem.id,
      count,
      label: selectedItem.label,
      inInventory: selectedItem.inInventory
    }
    dispatch({ type: "modObject", payload })
  }

  const onPressItem = (item: { id: string; label: string }) => {
    let inInventory = 0
    if (selectedCat === "caps") {
      inInventory = caps
    } else {
      inInventory = inventory[selectedCat].filter(el => item.id === el.id).length || 0
    }
    setSelectedItem({ ...item, inInventory })
  }

  const onPressNext = () => router.push({ pathname: routes.modal.updateObjectsConfirmation })
  const onPressCancel = () => {
    dispatch({ type: "reset" })
    router.back()
  }

  const hasSearch = selectedCat !== null && categoriesMap[selectedCat]?.hasSearch
  const selectors = selectedCat !== null ? categoriesMap[selectedCat].selectors : [1, 5, 20]

  const objectsList = useMemo(() => {
    if (selectedCat === null) return []
    const { data } = categoriesMap[selectedCat]
    const list = Object.values(data).map(({ id, label }) => ({ id, label }))
    if (!categoriesMap[selectedCat]?.hasSearch) return list
    return searchInput.length > 2
      ? list.filter(el => el.label.toLowerCase().includes(searchInput.toLowerCase()))
      : []
  }, [selectedCat, searchInput])

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
              onPress={() => setSelectedCat(id as SelectedCat)}
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
            renderItem={({ item }) => {
              const count = state[selectedCat][item.id]?.count || 0
              return (
                <TouchableOpacity
                  style={[
                    styles.listItemContainer,
                    selectedItem?.id === item.id && styles.listItemContainerSelected
                  ]}
                  onPress={() => onPressItem(item)}
                >
                  <Txt style={styles.listItem}>{item.label}</Txt>
                  {count > 0 && <Txt style={styles.listItem}>{count}</Txt>}
                </TouchableOpacity>
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
                data={selectors}
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
