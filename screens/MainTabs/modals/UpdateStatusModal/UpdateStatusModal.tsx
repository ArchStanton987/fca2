import React, { useState } from "react"
import { TouchableOpacity, View } from "react-native"

import { router, useLocalSearchParams } from "expo-router"

import { useProgress } from "lib/character/progress/progress-provider"

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
import { useGetUseCases } from "providers/UseCasesProvider"
import { UpdateStatusModalParams } from "screens/MainTabs/modals/UpdateStatusModal/UpdateStatusModal.params"
import {
  UpdatableStatusElement,
  UpdateStatusState
} from "screens/MainTabs/modals/UpdateStatusModal/UpdateStatusModal.types"
import { SearchParams, fromLocalParams } from "screens/ScreenParams"

import styles from "./UpdateStatusModal.styles"

const defaultState = { exp: { count: 0, initValue: 0 } }

export default function UpdateStatusModal() {
  const useCases = useGetUseCases()
  const localParams = useLocalSearchParams() as SearchParams<UpdateStatusModalParams>
  const { initCategory, charId } = fromLocalParams(localParams)

  const progress = useProgress(charId)

  const [updateState, setUpdateState] = useState<UpdateStatusState>(defaultState)
  const [selectedItem, setSelectedItem] = useState<UpdatableStatusElement | null>(initCategory)
  const [selectedAmount, setSelectedAmount] = useState<number>(1)

  const currentValue = selectedItem ? progress.exp : 0
  const currCount = selectedItem ? updateState[selectedItem].count : 0
  const newValue = currentValue + currCount

  const onPressIcon = (type: "plus" | "minus") => {
    if (!selectedItem) return
    const { count, initValue } = updateState[selectedItem]
    const val = type === "plus" ? count + selectedAmount : count - selectedAmount
    setUpdateState(prev => ({ ...prev, [selectedItem]: { count: val, initValue } }))
  }

  const onPressConfirm = async () => {
    await useCases.character.updateExp({ charId, newExp: newValue })
    router.back()
  }

  return (
    <ModalBody>
      <View style={styles.row}>
        <ScrollableSection title="STATUT" style={styles.statusSection}>
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
        <Spacer x={15} />
        <ViewSection title="TOTAL" style={styles.listSection}>
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
                <Txt>{newValue}</Txt>
              </View>
            </>
          )}
        </ViewSection>
        <Spacer x={15} />
        <ViewSection title="MODIFIER" style={styles.addSection}>
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
