import { useState } from "react"
import { StyleSheet, View } from "react-native"

import AmountSelector from "components/AmountSelector"
import List from "components/List"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import ViewSection from "components/ViewSection"
import MinusIcon from "components/icons/MinusIcon"
import PlusIcon from "components/icons/PlusIcon"
import RevertColorsPressable from "components/wrappers/RevertColorsPressable/RevertColorsPressable"
import { useSquad } from "contexts/SquadContext"
import { getDDMMYYYY, getHHMM } from "utils/date"

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  row: {
    flexDirection: "row",
    flex: 1
  },
  iconsContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center"
  }
})

type Timespan = "MIN" | "HOUR" | "DAY"
const timespans: Timespan[] = ["MIN", "HOUR", "DAY"]
const selectors = [1, 5, 20, 60]

export default function SquadDatetime() {
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

  const isDefault = newDate.getTime() === squad.date.getTime()

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <ViewSection title="DATE" style={{ flex: 1 }}>
          <Txt>{squad.data.label}</Txt>
          <Spacer y={50} />
          <Txt>Nous somme le : {getDDMMYYYY(squad.date)}</Txt>
          <Spacer y={15} />
          <Txt>Il est : {getHHMM(squad.date)}</Txt>
        </ViewSection>
        <Spacer x={15} />
        <ViewSection title="PREVIEW" style={{ flex: 1 }}>
          {isDefault ? (
            <Txt>Ajuster la nouvelle date</Txt>
          ) : (
            <>
              <Txt>Nouvelle date :</Txt>
              <Spacer y={50} />
              <Txt>{getDDMMYYYY(newDate)}</Txt>
              <Spacer y={15} />
              <Txt>Nouvelle heure :</Txt>
              <Spacer y={15} />
              <Txt>{getHHMM(newDate)}</Txt>
            </>
          )}
        </ViewSection>
        <Spacer x={15} />
        <ViewSection title="MODIFICATION" style={{ flex: 1 }}>
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
          <Spacer y={30} />
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
          <Spacer y={30} />
          <View style={styles.iconsContainer}>
            <MinusIcon size={62} onPress={() => onPressMod("minus")} />
            <PlusIcon size={62} onPress={() => onPressMod("plus")} />
          </View>
        </ViewSection>
      </View>
      <Spacer fullspace />
      <View style={{ flexDirection: "row", justifyContent: "center" }}>
        <RevertColorsPressable onPress={onPressReset}>
          <Txt>REINITIALISER</Txt>
        </RevertColorsPressable>
        <Spacer x={20} />
        <RevertColorsPressable disabled={newDate === null} onPress={onPressSave}>
          <Txt>ENREGISTRER</Txt>
        </RevertColorsPressable>
      </View>
    </View>
  )
}
