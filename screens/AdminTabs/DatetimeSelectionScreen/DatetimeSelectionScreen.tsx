import { useState } from "react"
import { View } from "react-native"

import AmountSelector from "components/AmountSelector"
import List from "components/List"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import ViewSection from "components/ViewSection"
import MinusIcon from "components/icons/MinusIcon"
import PlusIcon from "components/icons/PlusIcon"
import RevertColorsPressable from "components/wrappers/RevertColorsPressable/RevertColorsPressable"
import { useSquad } from "contexts/SquadContext"
import colors from "styles/colors"
import { getDDMMYYYY, getHHMM } from "utils/date"

import styles from "./DatetimeSelectionScreen.styles"

type Timespan = "MIN" | "HOUR" | "DAY"
const timespans: Timespan[] = ["MIN", "HOUR", "DAY"]
const selectors = [1, 5, 20, 60]

export default function DatetimeSelectionScreen() {
  const squad = useSquad()

  const [newDate, setNewDate] = useState<Date>(squad.date)
  const [selectedTimespan, setSelectedTimespan] = useState<Timespan>("MIN")
  const [selectedAmount, setSelectedAmount] = useState<number>(1)

  const onPressMod = (type: "plus" | "minus") => {
    if (!newDate) return
    const amount = selectedAmount * (type === "plus" ? 1 : -1)
    const newDateCopy = new Date(newDate)
    switch (selectedTimespan) {
      case "MIN":
        newDateCopy.setMinutes(newDateCopy.getMinutes() + amount)
        break
      case "HOUR":
        newDateCopy.setHours(newDateCopy.getHours() + amount)
        break
      case "DAY":
        newDateCopy.setDate(newDateCopy.getDate() + amount)
        break
      default:
        break
    }
    setNewDate(newDateCopy)
  }

  const onPressReset = () => setNewDate(squad.date)

  const onPressSave = async () => {
    if (!newDate) return
    await squad.setDatetime(newDate.getTime() / 1000)
  }

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <ViewSection title="NOUVELLE DATE" style={{ flex: 1 }}>
          <Spacer fullspace />
          <Txt style={{ textAlign: "center", fontSize: 35 }}>
            {getDDMMYYYY(newDate)} - {getHHMM(newDate)}
          </Txt>
          <Spacer fullspace />
          <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
            <RevertColorsPressable
              onPress={onPressReset}
              initAnimColor={colors.primColor}
              endAnimColor={colors.secColor}
              style={styles.cta}
            >
              <Txt>REINITIALISER</Txt>
            </RevertColorsPressable>
            <RevertColorsPressable
              disabled={newDate === null}
              onPress={onPressSave}
              style={[styles.cta, { backgroundColor: colors.secColor }]}
              initAnimColor={colors.secColor}
              endAnimColor={colors.primColor}
            >
              <Txt style={{ color: colors.primColor }}>ENREGISTRER</Txt>
            </RevertColorsPressable>
          </View>
          <Spacer y={30} />
        </ViewSection>
        <Spacer x={15} />
        <ViewSection title="MODIFICATION" style={{ width: 300 }}>
          <Spacer fullspace />
          <List
            data={timespans}
            keyExtractor={item => item}
            renderItem={({ item }) => (
              <AmountSelector
                value={item}
                isSelected={selectedTimespan === item}
                onPress={() => setSelectedTimespan(item)}
              />
            )}
            style={{ flexDirection: "row", justifyContent: "space-evenly" }}
          />
          <Spacer fullspace />
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
            style={{ flexDirection: "row", justifyContent: "space-evenly" }}
          />
          <Spacer fullspace />
          <View style={styles.iconsContainer}>
            <MinusIcon size={62} onPress={() => onPressMod("minus")} />
            <PlusIcon size={62} onPress={() => onPressMod("plus")} />
          </View>
          <Spacer fullspace />
        </ViewSection>
      </View>
    </View>
  )
}
