import React, { useState } from "react"
import { TouchableOpacity, View } from "react-native"

import { router, useLocalSearchParams } from "expo-router"

import { UpdatableStatusElement } from "lib/character/status/status.types"

import AmountSelector from "components/AmountSelector"
import List from "components/List"
import ModalCta from "components/ModalCta/ModalCta"
import ScrollableSection from "components/ScrollableSection"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import ViewSection from "components/ViewSection"
import MinusIcon from "components/icons/MinusIcon"
import PlusIcon from "components/icons/PlusIcon"
import ModalBody from "components/wrappers/ModalBody"
import routes from "constants/routes"
import { useCharacter } from "contexts/CharacterContext"
import { UpdateStatusModalParams } from "screens/MainTabs/modals/UpdateStatusModal/UpdateStatusModal.params"
import ScreenParams, { SearchParams } from "screens/ScreenParams"

import styles from "./UpdateStatusModal.styles"

type UpdateState = Record<UpdatableStatusElement, number>

export default function UpdateStatusModal() {
  const localParams = useLocalSearchParams<SearchParams<UpdateStatusModalParams>>()
  const { squadId, charId } = ScreenParams.fromLocalParams(localParams)

  const [updateState, setUpdateState] = useState<Record<UpdatableStatusElement, number>>(
    {} as UpdateState
  )
  const [selectedItem, setSelectedItem] = useState<UpdatableStatusElement | null>(null)
  const [selectedAmount, setSelectedAmount] = useState<number>(1)

  const { status } = useCharacter()
  const currentValue = selectedItem ? status[selectedItem] : 0
  const currCount = selectedItem ? updateState[selectedItem] : 0

  const onPressIcon = (type: "plus" | "minus") => {
    if (!selectedItem) return
    const value = updateState[selectedItem]
    const newValue = type === "plus" ? value + selectedAmount : value - selectedAmount
    setUpdateState(prev => ({ ...prev, [selectedItem]: newValue }))
  }

  const onPressConfirm = () => {
    // updateState to JSON serializable :
    const updates = JSON.stringify(updateState)
    router.push({
      pathname: `${routes.modal.updateStatusConfirmation}`,
      params: { squadId, charId, updates }
    })
  }

  return (
    <ModalBody>
      <View style={styles.row}>
        <ScrollableSection title="STATUT">
          <TouchableOpacity
            key="exp"
            style={[
              styles.listItemContainer,
              selectedItem === "exp" && styles.listItemContainerSelected
            ]}
            onPress={() => setSelectedItem("exp")}
          >
            <Txt style={styles.listItem}>EXP</Txt>
            <Spacer y={5} />
          </TouchableOpacity>
        </ScrollableSection>
        <ViewSection title="TOTAL">
          {!!selectedItem && typeof currentValue === "number" && (
            <>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Txt>actuel : </Txt>
                <Txt>{currentValue}</Txt>
              </View>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Txt>{currCount > 0 ? "à ajouter" : "à retirer"}</Txt>
                <Txt>{currCount}</Txt>
              </View>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Txt>Prévisionnel</Txt>
                <Txt>{currentValue + currCount}</Txt>
              </View>
            </>
          )}
        </ViewSection>
        <ViewSection title="MODIFIER">
          <View style={{ flex: 1, justifyContent: "space-evenly" }}>
            <List
              data={[1, 5, 20, 100]}
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
              <MinusIcon size={62} onPress={() => onPressIcon("minus")} />
              <PlusIcon size={62} onPress={() => onPressIcon("plus")} />
            </View>
          </View>
        </ViewSection>
      </View>
      <ModalCta onPressConfirm={onPressConfirm} />
    </ModalBody>
  )
}
