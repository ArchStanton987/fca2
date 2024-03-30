import { StyleSheet, View } from "react-native"

import ModalCta from "components/ModalCta/ModalCta"
import ScrollableSection from "components/ScrollableSection"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import TxtInput from "components/TxtInput"
import ViewSection from "components/ViewSection"
import MinusIcon from "components/icons/MinusIcon"
import PlusIcon from "components/icons/PlusIcon"

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    paddingBottom: 10
  },
  row: {
    flexDirection: "row",
    flex: 1
  },
  listSection: {
    flex: 1
  },
  searchSection: {
    width: 280,
    height: 90
  },
  addSection: {
    width: 280,
    flex: 1
  },
  iconsContainer: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "space-evenly",
    alignItems: "center"
  }
})

export default function UpdateEffectsModal() {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <ScrollableSection title="LISTE" style={styles.listSection}>
          <Txt>effects list</Txt>
        </ScrollableSection>
        <Spacer x={15} />
        <View>
          <ViewSection title="RECHERCHE" style={styles.searchSection}>
            <TxtInput />
          </ViewSection>
          <ViewSection title="AJOUTER" style={styles.addSection}>
            <View style={styles.iconsContainer}>
              <MinusIcon size={62} onPress={() => {}} />
              <PlusIcon size={62} onPress={() => {}} />
            </View>
          </ViewSection>
        </View>
      </View>
      <ModalCta onPressConfirm={() => {}} />
    </View>
  )
}
