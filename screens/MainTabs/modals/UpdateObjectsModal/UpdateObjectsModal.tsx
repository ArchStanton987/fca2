import { useMemo } from "react"
import { TouchableOpacityProps, View } from "react-native"

import { router, useLocalSearchParams } from "expo-router"

import { Item } from "lib/inventory/use-sub-inv-cat"
import { AmmoType } from "lib/objects/data/ammo/ammo.types"
import { ItemCategory } from "lib/objects/data/objects.types"

import AmountSelector from "components/AmountSelector"
import List from "components/List"
import ModalCta from "components/ModalCta/ModalCta"
import Row from "components/Row"
import ScrollableSection from "components/ScrollableSection"
import Selectable from "components/Selectable"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import TxtInput from "components/TxtInput"
import ViewSection from "components/ViewSection"
import MinusIcon from "components/icons/MinusIcon"
import PlusIcon from "components/icons/PlusIcon"
import ModalBody from "components/wrappers/ModalBody"
import routes from "constants/routes"
import { useCollectiblesData } from "providers/AdditionalElementsProvider"
import {
  getCategoriesMap,
  useBarterActions,
  useBarterAmount,
  useBarterCategory,
  useBarterInput,
  useBarterItemCount,
  useBarterSelectedItem,
  useInInvCount
} from "screens/MainTabs/modals/UpdateObjectsModal/UpdateObjectsModal.utils"
import { toLocalParams } from "screens/ScreenParams"

import styles from "./UpdateObjectsModal.styles"

type ListItemRowProps = TouchableOpacityProps & {
  id: "caps" | AmmoType | Item["id"]
  label: string
  isSelected: boolean
}

function ModButtons() {
  const { charId } = useLocalSearchParams<{ charId: string }>()
  const actions = useBarterActions()
  const selectedItem = useBarterSelectedItem()
  const inInv = useInInvCount(charId, selectedItem ?? "")
  return (
    <View style={styles.iconsContainer}>
      <MinusIcon size={62} onPress={() => actions.onPressMod("minus", inInv)} />
      <PlusIcon size={62} onPress={() => actions.onPressMod("plus", inInv)} />
    </View>
  )
}

function ListItemRow({ id, label, isSelected, ...rest }: ListItemRowProps) {
  const { charId } = useLocalSearchParams<{ charId: string }>()
  const inInv = useInInvCount(charId, id)
  const mod = useBarterItemCount(id)
  const final = inInv + mod
  return (
    <Selectable isSelected={isSelected} style={styles.listItemContainer} {...rest}>
      <Txt style={[styles.listItem, styles.listItemLabel]} numberOfLines={1}>
        {label}
      </Txt>
      <Txt style={[styles.listItem, styles.listItemInfo]}>{inInv}</Txt>
      <Txt style={[styles.listItem, styles.listItemInfo]}>{mod}</Txt>
      <Txt style={[styles.listItem, styles.listItemInfo]}>{final}</Txt>
    </Selectable>
  )
}

function ListItemHeader() {
  return (
    <Row style={styles.listItemContainer}>
      <Txt style={[styles.listItem, styles.listItemLabel]}>Obj</Txt>
      <Txt style={[styles.listItem, styles.listItemLabel]}>Inv</Txt>
      <Txt style={[styles.listItem, styles.listItemLabel]}>Mod</Txt>
      <Txt style={[styles.listItem, styles.listItemLabel]}>Prev</Txt>
    </Row>
  )
}

export default function UpdateObjectsModal() {
  const { charId, squadId, initCategory } = useLocalSearchParams<{
    charId: string
    squadId: string
    initCategory?: ItemCategory
  }>()

  const actions = useBarterActions()

  const category = useBarterCategory()
  const searchInput = useBarterInput()
  const selectedItem = useBarterSelectedItem()
  const selectedAmount = useBarterAmount()

  const allCollectibles = useCollectiblesData()
  const categories = getCategoriesMap(allCollectibles)

  const onPressNext = () => {
    const params = toLocalParams({ squadId, charId })
    router.push({ pathname: routes.modal.updateObjectsConfirmation, params })
  }

  const onPressCancel = () => {
    actions.reset()
    router.back()
  }

  const hasSearch = categories[category]?.hasSearch

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
    <ModalBody>
      <View style={styles.row}>
        <ScrollableSection title="CATEGORIES" style={styles.categoriesSection}>
          <List
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
        </ScrollableSection>
        <Spacer x={15} />
        <ScrollableSection title="LISTE" style={styles.listSection}>
          <List
            data={objectsList}
            keyExtractor={item => item.id}
            ListHeaderComponent={ListItemHeader}
            renderItem={({ item }) => (
              <ListItemRow
                id={item.id}
                label={item.label}
                isSelected={selectedItem === item.id}
                onPress={() => actions.selectItem(item.id)}
              />
            )}
          />
        </ScrollableSection>
        <Spacer x={15} />
        <View>
          {hasSearch && (
            <ViewSection title="RECHERCHE" style={styles.searchSection}>
              <TxtInput value={searchInput} onChangeText={e => actions.setInput(e)} />
            </ViewSection>
          )}
          <ViewSection title="AJOUTER" style={styles.addSection}>
            <View style={{ flex: 1, justifyContent: "space-evenly" }}>
              <List
                data={categories[category].selectors}
                keyExtractor={item => item.toString()}
                renderItem={({ item }) => (
                  <AmountSelector
                    value={item}
                    isSelected={selectedAmount === item}
                    onPress={() => actions.selectAmount(item)}
                  />
                )}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-evenly"
                }}
              />
              <ModButtons />
            </View>
          </ViewSection>
        </View>
      </View>
      <ModalCta onPressConfirm={onPressNext} onPressCancel={onPressCancel} />
    </ModalBody>
  )
}
