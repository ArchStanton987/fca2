import { memo, useState } from "react"
import { View } from "react-native"

import Toast from "react-native-toast-message"

import AmountSelector from "components/AmountSelector"
import List from "components/List"
import Spacer from "components/Spacer"
import TabPage from "components/TabPage"
import Txt from "components/Txt"
import ViewSection from "components/ViewSection"
import MinusIcon from "components/icons/MinusIcon"
import PlusIcon from "components/icons/PlusIcon"
import RevertColorsPressable from "components/wrappers/RevertColorsPressable/RevertColorsPressable"
import { useAdmin } from "contexts/AdminContext"
import { useSquad } from "contexts/SquadContext"
import { useGetUseCases } from "providers/UseCasesProvider"
import colors from "styles/colors"
import { getDDMMYYYY, getHHMM } from "utils/date"

import styles from "./DatetimeSelectionScreen.styles"

type Timespan = "MIN" | "HOUR" | "DAY"
const timespans: Timespan[] = ["MIN", "HOUR", "DAY"]
const selectors = [1, 5, 20, 60]

function DatetimeSelectionScreen() {
  const useCases = useGetUseCases()
  const squad = useSquad()
  const { characters, enemies } = useAdmin()

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
    try {
      await useCases.squad.updateDate(
        squad.squadId,
        newDate,
        Object.values({ ...characters, ...enemies })
      )
      Toast.show({
        type: "custom",
        text1: "Le temps a bien été modifié"
      })
    } catch (err: any) {
      Toast.show({ type: "error", text1: "Erreur lors de la mise à jour de la date" })
    }
  }

  return (
    <>
      <TabPage>
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
      </TabPage>
      <Spacer y={10} />
    </>
  )
}

export default memo(DatetimeSelectionScreen)
