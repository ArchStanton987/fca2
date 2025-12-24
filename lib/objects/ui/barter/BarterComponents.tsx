import { useMemo } from "react"

import { useCurrCharId } from "lib/character/character-store"
import AmountSelectorList from "lib/common/ui/AmountSelectorList"
import ModQuantityButtons from "lib/common/ui/ModQuantityButtons"
import { Item } from "lib/inventory/item.mappers"
import {
  getCategoriesMap,
  useBarterActions,
  useBarterAmount,
  useBarterCategory,
  useBarterInput,
  useBarterItemCount,
  useBarterSelectedItem,
  useInInvCount
} from "lib/objects/barter-store"
import { AmmoType } from "lib/objects/data/ammo/ammo.types"

import List from "components/List"
import Row from "components/Row"
import Section from "components/Section"
import Selectable from "components/Selectable"
import Txt from "components/Txt"
import TxtInput from "components/TxtInput"
import { useCollectiblesData } from "providers/AdditionalElementsProvider"

import styles from "./BarterComponents.styles"

function Categories() {
  const actions = useBarterActions()
  const category = useBarterCategory()
  const allCollectibles = useCollectiblesData()
  const categories = getCategoriesMap(allCollectibles)
  return (
    <List
      style={styles.categoriesContainer}
      data={Object.values(categories)}
      keyExtractor={c => c.id}
      renderItem={({ item }) => (
        <Selectable
          isSelected={category === item.id}
          onPress={() => actions.selectCategory(item.id)}
        >
          <Txt style={styles.listItem}>{item.label}</Txt>
        </Selectable>
      )}
    />
  )
}

function Selectors() {
  const actions = useBarterActions()
  const category = useBarterCategory()
  const allCollectibles = useCollectiblesData()
  const categories = getCategoriesMap(allCollectibles)
  const selectedAmount = useBarterAmount()
  return (
    <AmountSelectorList
      items={categories[category].selectors}
      onPressAmount={actions.selectAmount}
      selectedAmount={selectedAmount}
    />
  )
}

function ModButtons() {
  const charId = useCurrCharId()
  const actions = useBarterActions()
  const selectedItem = useBarterSelectedItem()
  const inInv = useInInvCount(charId, selectedItem ?? "")
  return (
    <ModQuantityButtons
      onPressPlus={() => actions.onPressMod("plus", inInv)}
      onPressMinus={() => actions.onPressMod("minus", inInv)}
    />
  )
}

function ModQuantity() {
  return (
    <Section
      title="+/-"
      style={styles.addSection}
      contentContainerStyle={styles.addSectionContainer}
    >
      <Selectors />
      <ModButtons />
    </Section>
  )
}

type ListItemRowProps = {
  id: "caps" | AmmoType | Item["id"]
  label: string
}

function ListItemRow({ id, label }: ListItemRowProps) {
  const charId = useCurrCharId()

  const actions = useBarterActions()

  const selectedItem = useBarterSelectedItem()
  const isSelected = selectedItem === id

  const inInv = useInInvCount(charId, id)
  const mod = useBarterItemCount(id)
  const final = inInv + mod
  return (
    <Selectable
      isSelected={isSelected}
      style={styles.listItemContainer}
      onPress={() => actions.selectItem(id)}
    >
      <Txt style={styles.listItemLabel} numberOfLines={1}>
        {label}
      </Txt>
      <Txt style={styles.listItemInfo}>{inInv}</Txt>
      <Txt style={styles.listItemInfo}>{mod}</Txt>
      <Txt style={styles.listItemInfo}>{final}</Txt>
    </Selectable>
  )
}

function ListItemHeader() {
  return (
    <Row style={styles.listItemContainer}>
      <Txt style={styles.listItemLabel}>Obj</Txt>
      <Txt style={styles.listItemInfo}>Inv</Txt>
      <Txt style={styles.listItemInfo}>Mod</Txt>
      <Txt style={styles.listItemInfo}>Prev</Txt>
    </Row>
  )
}

function SearchInput() {
  const input = useBarterInput()
  const actions = useBarterActions()
  return (
    <Section title="recherche">
      <TxtInput value={input} onChangeText={e => actions.setInput(e)} />
    </Section>
  )
}

function ObjectsList() {
  const searchInput = useBarterInput()
  const category = useBarterCategory()

  const allCollectibles = useCollectiblesData()
  const categories = getCategoriesMap(allCollectibles)
  const objectsList = useMemo(() => {
    if (category === null) return []
    const { data } = categories[category]
    const list = Object.values(data).map(({ id, label }) => ({ id, label }))
    if (!categories[category]?.hasSearch) return list
    return searchInput.length > 2
      ? list.filter(el => {
          if (category === "weapons" && el.id === "unarmed") return false
          return el.label.toLowerCase().includes(searchInput.toLowerCase())
        })
      : []
  }, [category, searchInput, categories])

  return (
    <List
      data={objectsList}
      keyExtractor={item => item.id}
      ListHeaderComponent={ListItemHeader}
      renderItem={({ item }) => <ListItemRow id={item.id} label={item.label} />}
    />
  )
}

const BarterComponents = {
  ModQuantity,
  Categories,
  ModButtons,
  ListItemRow,
  ListItemHeader,
  SearchInput,
  ObjectsList
}

export default BarterComponents
