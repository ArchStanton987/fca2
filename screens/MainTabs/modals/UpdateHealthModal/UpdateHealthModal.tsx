import React, { useReducer, useState } from "react"
import { TouchableOpacity, View } from "react-native"

import { router, useLocalSearchParams } from "expo-router"

import healthMap from "lib/character/health/health"
import healthReducer, { defaultHealthUpdate } from "lib/character/health/health-reducer"
import { HealthStatusId } from "lib/character/health/health-types"

import AmountSelector from "components/AmountSelector"
import List from "components/List"
import ModalCta from "components/ModalCta/ModalCta"
import ScrollableSection from "components/ScrollableSection"
import Txt from "components/Txt"
import ViewSection from "components/ViewSection"
import MinusIcon from "components/icons/MinusIcon"
import PlusIcon from "components/icons/PlusIcon"
import ModalBody from "components/wrappers/ModalBody"
import routes from "constants/routes"
import { useCharacter } from "contexts/CharacterContext"
import { UpdateHealthModalParams } from "screens/MainTabs/modals/UpdateHealthModal/UpdateHealthModal.params"
import ScreenParams, { SearchParams } from "screens/ScreenParams"

import styles from "./UpdateHealthModal.styles"

export default function UpdateHealthModal() {
  const localParams = useLocalSearchParams() as SearchParams<UpdateHealthModalParams>
  const { squadId, charId, initElement } = ScreenParams.fromLocalParams(localParams)

  const character = useCharacter()
  const { status } = character

  const [state, dispatch] = useReducer(healthReducer, defaultHealthUpdate)
  const [selectedItem, setSelectedItem] = useState<HealthStatusId>(initElement)
  const [selectedAmount, setSelectedAmount] = useState<number>(1)

  const initValue = status[selectedItem]
  const currCount = state[selectedItem].count || 0
  const prev = initValue + currCount

  const onPressIcon = (type: "plus" | "minus") => {
    if (!selectedItem) return
    const newValue = type === "plus" ? selectedAmount : -selectedAmount
    dispatch({
      type: "mod",
      payload: {
        id: selectedItem,
        label: healthMap[selectedItem].label,
        count: newValue,
        initValue
      }
    })
  }

  const onPressConfirm = () =>
    router.push({ pathname: routes.modal.updateHealthConfirmation, params: { charId, squadId } })

  const onCancel = () => {
    dispatch({ type: "reset" })
    router.back()
  }

  return (
    <ModalBody>
      <View style={styles.row}>
        <ScrollableSection title="ÉLÉMENT">
          {Object.values(healthMap).map(health => (
            <TouchableOpacity
              key={health.id}
              onPress={() => setSelectedItem(health.id)}
              style={[styles.listItem, selectedItem === health.id && styles.selected]}
            >
              <Txt>{health.label}</Txt>
            </TouchableOpacity>
          ))}
        </ScrollableSection>
        <ViewSection title="TOTAL">
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Txt>actuel : </Txt>
            <Txt>{initValue}</Txt>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Txt>{currCount > 0 ? "à ajouter" : "à retirer"}</Txt>
            <Txt>{currCount}</Txt>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Txt>Prévisionnel</Txt>
            <Txt>{prev}</Txt>
          </View>
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
      <ModalCta onPressConfirm={onPressConfirm} onPressCancel={onCancel} />
    </ModalBody>
  )
}