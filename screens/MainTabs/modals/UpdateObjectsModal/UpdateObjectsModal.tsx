import { useMemo, useState } from "react"
import { TouchableOpacity, View } from "react-native"

import { router, useLocalSearchParams } from "expo-router"

import ammoMap from "lib/objects/data/ammo/ammo"
import { AmmoType } from "lib/objects/data/ammo/ammo.types"
import clothingsMap from "lib/objects/data/clothings/clothings"
import { ClothingId } from "lib/objects/data/clothings/clothings.types"
import consumablesMap from "lib/objects/data/consumables/consumables"
import { ConsumableId } from "lib/objects/data/consumables/consumables.types"
import miscObjectsMap from "lib/objects/data/misc-objects/misc-objects"
import { MiscObjectId } from "lib/objects/data/misc-objects/misc-objects-types"
import weaponsMap from "lib/objects/data/weapons/weapons"
import { WeaponId } from "lib/objects/data/weapons/weapons.types"
import { ObjectContentPayload, ObjectExchangeState } from "lib/objects/objects-reducer"

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
import { useCharacter } from "contexts/CharacterContext"
import { useInventory } from "contexts/InventoryContext"
import { useUpdateObjects } from "contexts/UpdateObjectsContext"
import { UpdateObjectsModalParams } from "screens/MainTabs/modals/UpdateObjectsModal/UpdateObjectsModal.params"
import ScreenParams, { SearchParams } from "screens/ScreenParams"

import styles from "./UpdateObjectsModal.styles"

type CategoryId = keyof ObjectExchangeState
type Category = {
  id: CategoryId
  label: string
  selectors: number[]
  hasSearch?: boolean
  data: Record<string, { id: string; label: string }>
}

export const categoriesMap: Record<CategoryId, Category> = {
  weapons: { id: "weapons", label: "Armes", selectors: [1, 5], hasSearch: true, data: weaponsMap },
  clothings: { id: "clothings", label: "Armures", selectors: [1, 5], data: clothingsMap },
  consumables: {
    id: "consumables",
    label: "Consommables",
    selectors: [1, 5, 20],
    data: consumablesMap
  },
  miscObjects: {
    id: "miscObjects",
    label: "Objets",
    selectors: [1, 5, 20, 100],
    hasSearch: true,
    data: miscObjectsMap
  },
  ammo: { id: "ammo", label: "Munitions", selectors: [1, 5, 20, 100], data: ammoMap },
  caps: {
    id: "caps",
    label: "Caps",
    selectors: [1, 5, 20, 100, 500],
    data: { caps: { id: "caps", label: "Capsule(s)" } }
  }
}

type SelectedItem = WeaponId | ClothingId | ConsumableId | MiscObjectId | AmmoType | "caps" | null

const categories = Object.values(categoriesMap)

export default function UpdateObjectsModal() {
  const localParams = useLocalSearchParams() as SearchParams<UpdateObjectsModalParams>
  const { initCategory = "weapons" } = ScreenParams.fromLocalParams(localParams)
  const [selectedCat, setSelectedCat] = useState<keyof ObjectExchangeState>(initCategory)
  const [selectedItem, setSelectedItem] = useState<SelectedItem>(null)
  const [selectedAmount, setSelectedAmount] = useState<number>(1)
  const [searchInput, setSearchInput] = useState("")

  const character = useCharacter()
  const inventory = useInventory()
  const { caps } = character.status

  const { state, dispatch } = useUpdateObjects()

  const onPressMod = (modType: "minus" | "plus") => {
    if (selectedItem === null) return
    const count = modType === "minus" ? -selectedAmount : selectedAmount
    if (selectedCat === "caps") {
      dispatch({ type: "modCaps", payload: { count, inInventory: caps } })
      return
    }
    dispatch({
      type: "modObject",
      payload: {
        category: selectedCat,
        id: selectedItem as keyof ObjectExchangeState[typeof selectedCat],
        count,
        label: categoriesMap[selectedCat].data[selectedItem].label,
        inInventory: inventory[selectedCat].filter(el => selectedItem === el.id).length || 0
      }
    })
  }

  const onPressItem = (id: SelectedItem) => setSelectedItem(prev => (prev === id ? null : id))

  const onPressNext = () => router.push({ pathname: routes.modal.updateObjectsConfirmation })

  const hasSearch = selectedCat !== null && categoriesMap[selectedCat].hasSearch
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
              onPress={() => setSelectedCat(id)}
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
              let count = 0
              if (selectedCat === "caps") {
                count = state.caps
              }
              if (selectedCat !== null) {
                count =
                  (state[selectedCat] as Record<string, ObjectContentPayload>)[item.id]?.amount || 0
              }
              return (
                <TouchableOpacity
                  style={[
                    styles.listItemContainer,
                    selectedItem === item.id && styles.listItemContainerSelected
                  ]}
                  onPress={() => onPressItem(item.id as SelectedItem)}
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
      <ModalCta onPressConfirm={onPressNext} />
    </ModalBody>
  )
}
