import { useMemo, useState } from "react"
import { TouchableOpacity, View } from "react-native"

import ammoMap from "lib/objects/data/ammo/ammo"
import clothingsMap from "lib/objects/data/clothings/clothings"
import consumablesMap from "lib/objects/data/consumables/consumables"
import miscObjectsMap from "lib/objects/data/misc-objects/misc-objects"
import weaponsMap from "lib/objects/data/weapons/weapons"
import { ObjectExchangeState } from "lib/objects/objects-reducer"

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
import { useUpdateObjects } from "contexts/UpdateObjectsContext"

import styles from "./UpdateObjectsModal.styles"

type CategoryId = keyof ObjectExchangeState
type Category = {
  id: CategoryId
  label: string
  selectors: number[]
  hasSearch?: boolean
  data: Record<string, { id: string; label: string }>
}

const categoriesMap: Record<CategoryId, Category> = {
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

const categories = Object.values(categoriesMap)

export default function UpdateObjectsModal() {
  // TODO: add default selected cat & add as param
  const [selectedCat, setSelectedCat] = useState<CategoryId | null>(null)
  const [selectedItem, setSelectedItem] = useState<string | null>(null)
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null)
  const [searchInput, setSearchInput] = useState("")

  const { state, dispatch } = useUpdateObjects()

  const onPressItem = (id: string) => setSelectedItem(prev => (prev === id ? null : id))

  const hasSearch = selectedCat !== null && categoriesMap[selectedCat].hasSearch
  const selectors = selectedCat !== null ? categoriesMap[selectedCat].selectors : [1, 5, 20]

  const objectsList = useMemo(() => {
    if (selectedCat === null) return []
    const { data } = categoriesMap[selectedCat]
    const list = Object.values(data).map(({ id, label }) => ({ id, label }))
    if (!categoriesMap[selectedCat]?.hasSearch) return list
    return searchInput.length > 2 ? list.filter(el => el.id.includes(searchInput)) : list
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
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.listItemContainer,
                  selectedItem === item.id && styles.listItemContainerSelected
                ]}
                onPress={() => onPressItem(item.id)}
              >
                <Txt style={styles.listItem}>{item.label}</Txt>
              </TouchableOpacity>
            )}
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
                <MinusIcon size={62} onPress={() => {}} />
                <PlusIcon size={62} onPress={() => {}} />
              </View>
            </View>
          </ViewSection>
        </View>
      </View>
      <ModalCta onPressConfirm={() => {}} />
    </ModalBody>
  )
}
