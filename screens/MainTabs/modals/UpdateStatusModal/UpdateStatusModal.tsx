import React, { useState } from "react"
import { TouchableOpacity, View } from "react-native"

import { router, useLocalSearchParams } from "expo-router"

import { limbsMap } from "lib/character/health/health"
import { DbStatus } from "lib/character/status/status.types"

import AmountSelector from "components/AmountSelector"
import { DrawerParams } from "components/Drawer/Drawer.params"
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
import ScreenParams, { SearchParams } from "screens/ScreenParams"

import styles from "./UpdateStatusModal.styles"

type UpdateState = Record<keyof DbStatus, number>

export default function UpdateStatusModal() {
  const localParams = useLocalSearchParams<SearchParams<DrawerParams>>()
  const { squadId, charId } = ScreenParams.fromLocalParams(localParams)

  const [updateState, setUpdateState] = useState<Record<keyof DbStatus, number>>({} as UpdateState)
  const [selectedItem, setSelectedItem] = useState<keyof DbStatus | null>(null)
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
          {Object.values(limbsMap).map(limb => (
            <TouchableOpacity
              key={limb.id}
              style={[
                styles.listItemContainer,
                selectedItem === limb.id && styles.listItemContainerSelected
              ]}
              onPress={() => setSelectedItem(limb.id)}
            >
              <Txt style={styles.listItem}>{limb.label}</Txt>
              <Spacer y={5} />
            </TouchableOpacity>
          ))}
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
          <TouchableOpacity
            key="rads"
            style={[
              styles.listItemContainer,
              selectedItem === "rads" && styles.listItemContainerSelected
            ]}
            onPress={() => setSelectedItem("rads")}
          >
            <Txt style={styles.listItem}>RADS</Txt>
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
