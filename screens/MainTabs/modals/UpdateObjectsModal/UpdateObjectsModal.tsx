import { useState } from "react"
import { StyleSheet, TouchableOpacity, View } from "react-native"

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
import colors from "styles/colors"

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    paddingBottom: 10
  },
  row: {
    flexDirection: "row",
    flex: 1
  },
  categoriesSection: {
    width: 160
  },
  listSection: {
    flex: 1
  },
  searchSection: {
    width: 280,
    height: 90
  },
  addSection: {
    width: 280,
    flex: 1
  },
  iconsContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center"
  },
  listItemContainer: {
    paddingLeft: 5,
    paddingVertical: 7
  },
  listItemContainerSelected: {
    backgroundColor: colors.terColor
  },
  listItem: {}
})

type CategoryId = keyof ObjectExchangeState
type Category = { id: CategoryId; label: string; selectors: number[]; hasSearch?: boolean }

const categoriesMap: Record<CategoryId, Category> = {
  weapons: { id: "weapons", label: "Armes", selectors: [1, 5], hasSearch: true },
  clothings: { id: "clothings", label: "Armures", selectors: [1, 5] },
  consumables: { id: "consumables", label: "Consommables", selectors: [1, 5, 20] },
  miscObjects: { id: "miscObjects", label: "Objets", selectors: [1, 5, 20, 100], hasSearch: true },
  ammo: { id: "ammo", label: "Munitions", selectors: [1, 5, 20, 100] },
  caps: { id: "caps", label: "Caps", selectors: [1, 5, 20, 100, 500] }
}

const categories = Object.values(categoriesMap)

export default function UpdateObjectsModal() {
  const [selectedCat, setSelectedCat] = useState<CategoryId | null>(null)
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null)
  const [searchInput, setSearchInput] = useState("")

  const hasSearch = selectedCat !== null && categoriesMap[selectedCat].hasSearch
  const selectors = selectedCat !== null ? categoriesMap[selectedCat].selectors : [1, 5, 20]

  return (
    <View style={styles.container}>
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
            </TouchableOpacity>
          ))}
        </ScrollableSection>
        <Spacer x={15} />
        <ScrollableSection title="LISTE" style={styles.listSection}>
          <Txt>objects list</Txt>
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
    </View>
  )
}
