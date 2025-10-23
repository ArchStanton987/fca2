import { StyleSheet, View } from "react-native"

import { router, useLocalSearchParams } from "expo-router"

import UpdateHealthComponents from "lib/character/health/ui/update-health/UpdateHealthComponents"
import { useUpdateHealthActions } from "lib/character/health/update-health-store"

import ModalCta from "components/ModalCta/ModalCta"
import Row from "components/Row"
import ScrollableSection from "components/ScrollableSection"
import Spacer from "components/Spacer"
import ViewSection from "components/ViewSection"
import ModalBody from "components/wrappers/ModalBody"
import routes from "constants/routes"

const styles = StyleSheet.create({
  categoriesSection: {
    width: 160
  },
  listSection: {
    flex: 1
  },
  addSection: {
    width: 280,
    flex: 1
  },
  iconsContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center"
  }
})

export default function UpdateHealthModal() {
  const { squadId, charId } = useLocalSearchParams<{ charId: string; squadId: string }>()

  const actions = useUpdateHealthActions()

  const onPressConfirm = () =>
    router.push({ pathname: routes.modal.updateHealthConfirmation, params: { charId, squadId } })

  const onCancel = () => {
    actions.reset()
    router.back()
  }

  return (
    <ModalBody>
      <Row style={{ flex: 1 }}>
        <ScrollableSection title="ÉLÉMENTS" style={styles.categoriesSection}>
          <UpdateHealthComponents.CategoryList />
        </ScrollableSection>
        <Spacer x={15} />
        <ViewSection title="MODIFICATIONS" style={styles.listSection}>
          <UpdateHealthComponents.ElementList />
        </ViewSection>
        <Spacer x={15} />
        <ViewSection title="MODIFIER" style={styles.addSection}>
          <View style={{ flex: 1, justifyContent: "space-evenly" }}>
            <UpdateHealthComponents.AmountsList />
            <View style={styles.iconsContainer}>
              <UpdateHealthComponents.HealthUpdateButtons />
            </View>
          </View>
        </ViewSection>
      </Row>
      <ModalCta onPressConfirm={onPressConfirm} onPressCancel={onCancel} />
    </ModalBody>
  )
}
