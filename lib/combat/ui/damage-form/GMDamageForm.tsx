import { StyleSheet } from "react-native"

import { useCombatId } from "lib/character/combat-status/combat-status-provider"
import { useCombatState } from "lib/combat/use-cases/sub-combat"
import { getRealDamage } from "lib/combat/utils/combat-utils"
import { useItems } from "lib/inventory/use-sub-inv-cat"

import Col from "components/Col"
import DrawerPage from "components/DrawerPage"
import Row from "components/Row"
import Section from "components/Section"
import ScrollSection from "components/Section/ScrollSection"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import TxtInput from "components/TxtInput"
import PlusIcon from "components/icons/PlusIcon"
import { useDamageFormActions } from "providers/DamageFormProvider"
import layout from "styles/layout"

import DamageEntries from "./DamageEntries"
import DamageFormListPicker from "./DamageFormListPicker"
import SubmitDamageForm from "./inputs/SubmitDamageForm"

const styles = StyleSheet.create({
  centeredSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  submitSection: {
    justifyContent: "center",
    alignItems: "center"
  }
})

export default function GMDamageForm({ charId }: { charId: string }) {
  const { data: combatId } = useCombatId(charId)
  const combatState = useCombatState(combatId, cs => ({
    rawDamage: cs.action.rawDamage || 0,
    damageType: cs.action.damageType || "physical",
    targetId: cs.action.targetId || "",
    damageLocalization: cs.action.aimZone || cs.action.damageLocalization || "rightTorso"
  }))
  const { data: targetItems } = useItems(combatState.data.targetId)
  const realDamage = getRealDamage(targetItems, {
    damageType: combatState.data.damageType,
    rawDamage: combatState.data.rawDamage,
    damageLocalization: combatState.data.damageLocalization
  })

  const actions = useDamageFormActions()
  return (
    <DrawerPage>
      <ScrollSection style={{ flex: 1 }} title="entrées de dégâts">
        <Row>
          <Col style={{ flex: 1 }}>
            <Txt>Dég. bruts : </Txt>
            <TxtInput readOnly editable={false} value={combatState.data.rawDamage.toString()} />
          </Col>
          <Spacer x={layout.globalPadding} />
          <Col style={{ flex: 1 }}>
            <Txt>Dég. réels :</Txt>
            <TxtInput readOnly editable={false} value={realDamage?.toString()} />
          </Col>
          <Spacer x={layout.globalPadding} />
          <Col style={{ flex: 1 }}>
            <Txt>Type :</Txt>
            <TxtInput readOnly editable={false} value={combatState.data.damageType} />
          </Col>
        </Row>

        <Spacer y={layout.globalPadding} />

        <Row style={{ alignItems: "center" }}>
          <Txt>ENTREES</Txt>
          <Spacer x={layout.globalPadding} />
          <PlusIcon size={40} onPress={() => actions.addEntry()} />
        </Row>

        <DamageEntries />
      </ScrollSection>

      <Spacer x={layout.globalPadding} />

      <Col style={{ width: 100 }}>
        <ScrollSection style={{ flex: 1 }}>
          <DamageFormListPicker />
        </ScrollSection>

        <Spacer y={layout.globalPadding} />

        <Section title="valider" contentContainerStyle={styles.submitSection}>
          <SubmitDamageForm />
        </Section>
      </Col>
    </DrawerPage>
  )
}
