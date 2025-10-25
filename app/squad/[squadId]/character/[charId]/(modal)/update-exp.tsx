import React, { useState } from "react"
import { StyleSheet, TouchableOpacity, View } from "react-native"

import { router, useLocalSearchParams } from "expo-router"

import { useExp } from "lib/character/progress/exp-provider"
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
import colors from "styles/colors"

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    flex: 1
  },
  statusSection: {
    width: 160
  },
  listSection: {
    flex: 1
  },
  addSection: {
    width: 280
  },
  iconsContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center"
  },
  listItemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 5,
    paddingVertical: 7
  },
  listItemContainerSelected: {
    backgroundColor: colors.terColor
  },
  listItem: {}
})

export default function UpdateStatusModal() {
  const { charId } = useLocalSearchParams<{ charId: string }>()
  const useCases = useGetUseCases()

  const { data: exp } = useExp(charId)

  const [expMod, setExpMod] = useState(0)
  const [selectedAmount, setSelectedAmount] = useState<number>(1)

  const newValue = exp + expMod

  const onPressIcon = (type: "plus" | "minus") => {
    const amount = type === "plus" ? selectedAmount : -selectedAmount
    let newMod = exp + amount
    if (exp + amount < 0) newMod = -exp
    setExpMod(newMod)
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
            style={[styles.listItemContainer, styles.listItemContainerSelected]}
          >
            <Txt style={styles.listItem}>EXP</Txt>
            <Spacer y={5} />
          </TouchableOpacity>
        </ScrollableSection>
        <Spacer x={15} />
        <ViewSection title="TOTAL" style={styles.listSection}>
          <>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Txt>actuel : </Txt>
              <Txt>{exp}</Txt>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Txt>{expMod > 0 ? "à ajouter" : "à retirer"}</Txt>
              <Txt>{expMod}</Txt>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Txt>Prévisionnel</Txt>
              <Txt>{newValue}</Txt>
            </View>
          </>
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
