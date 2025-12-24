import { router, useLocalSearchParams } from "expo-router"

import { useCurrCharId } from "lib/character/character-store"
import UpdateHealthComponents from "lib/character/health/ui/update-health/UpdateHealthComponents"
import { useUpdateHealthActions } from "lib/character/health/update-health-store"

import ModalCta from "components/ModalCta/ModalCta"
import Row from "components/Row"
import Section from "components/Section"
import ScrollSection from "components/Section/ScrollSection"
import Spacer from "components/Spacer"
import ModalBody from "components/wrappers/ModalBody"

import styles from "lib/character/health/ui/update-health/UpdateHealthComponents.styles"

export default function UpdateHealthModal() {
  const { squadId } = useLocalSearchParams<{ squadId: string }>()
  const charId = useCurrCharId()

  const actions = useUpdateHealthActions()

  const onPressConfirm = () =>
    router.push({
      pathname: "/squad/[squadId]/character/[charId]/update-health-confirmation",
      params: { charId, squadId }
    })

  const onCancel = () => {
    actions.reset()
    router.back()
  }

  return (
    <ModalBody>
      <Row style={{ flex: 1 }}>
        <ScrollSection title="ÉLÉMENTS" style={styles.categoriesSection}>
          <UpdateHealthComponents.CategoryList />
        </ScrollSection>
        <Spacer x={15} />
        <ScrollSection title="MODIFICATIONS" style={styles.listSection}>
          <UpdateHealthComponents.ElementList />
        </ScrollSection>
        <Spacer x={15} />
        <Section
          title="MODIFIER"
          style={styles.addSection}
          contentContainerStyle={styles.addSectionContainer}
        >
          <UpdateHealthComponents.AmountsList />
          <UpdateHealthComponents.HealthUpdateButtons />
        </Section>
      </Row>
      <ModalCta onPressConfirm={onPressConfirm} onPressCancel={onCancel} />
    </ModalBody>
  )
}
