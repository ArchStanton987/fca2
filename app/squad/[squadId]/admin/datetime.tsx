import { useMemo, useState } from "react"
import { StyleSheet, TouchableOpacity, View } from "react-native"

import { useLocalSearchParams } from "expo-router"

import LoadPlayables from "lib/character/use-cases/load-playables"
import { useDatetime, useSquadNpcs } from "lib/squad/use-cases/sub-squad"
import Toast from "react-native-toast-message"

import AmountSelector from "components/AmountSelector"
import List from "components/List"
import Spacer from "components/Spacer"
import TabPage from "components/TabPage"
import Txt from "components/Txt"
import ViewSection from "components/ViewSection"
import MinusIcon from "components/icons/MinusIcon"
import PlusIcon from "components/icons/PlusIcon"
import { useGetUseCases } from "providers/UseCasesProvider"
import colors from "styles/colors"
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
  },
  cta: {
    padding: 12,
    borderWidth: 2,
    borderColor: colors.secColor,
    width: 130,
    justifyContent: "center",
    alignItems: "center"
  }
})

type Timespan = "MIN" | "HOUR" | "DAY"
const timespans: Timespan[] = ["MIN", "HOUR", "DAY"]
const selectors = [1, 5, 20, 60]

export default function Screen() {
  const { squadId } = useLocalSearchParams<{ squadId: string }>()
  const useCases = useGetUseCases()

  const { data: datetime } = useDatetime(squadId)
  const { data: npcs } = useSquadNpcs(squadId)
  const npcsIds = useMemo(() => Object.keys(npcs), [npcs])

  const [newDate, setNewDate] = useState<Date>(() => datetime)
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

  const onPressReset = () => setNewDate(datetime)

  const onPressSave = async () => {
    if (!newDate) return
    try {
      const payload = { squadId, newDate }
      await useCases.gm.updateDatetime(payload)
      Toast.show({
        type: "custom",
        text1: "Le temps a bien été modifié"
      })
    } catch (err: any) {
      Toast.show({ type: "error", text1: "Erreur lors de la mise à jour de la date" })
    }
  }

  return (
    <LoadPlayables playablesIds={npcsIds}>
      <TabPage>
        <View style={styles.row}>
          <ViewSection title="NOUVELLE DATE" style={{ flex: 1 }}>
            <Spacer fullspace />
            <Txt style={{ textAlign: "center", fontSize: 35 }}>
              {getDDMMYYYY(newDate)} - {getHHMM(newDate)}
            </Txt>
            <Spacer fullspace />
            <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
              <TouchableOpacity onPress={onPressReset} style={styles.cta}>
                <Txt>REINITIALISER</Txt>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={newDate === null}
                onPress={onPressSave}
                style={[styles.cta, { backgroundColor: colors.secColor }]}
              >
                <Txt style={{ color: colors.primColor }}>ENREGISTRER</Txt>
              </TouchableOpacity>
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
      <Spacer y={15} />
    </LoadPlayables>
  )
}
