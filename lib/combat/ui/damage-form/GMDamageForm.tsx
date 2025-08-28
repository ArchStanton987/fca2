import { StyleSheet } from "react-native"

import { DamageTypeId } from "lib/objects/data/weapons/weapons.types"

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

type GMDamageScreenProps = {
  rawDamage?: number
  realDamage?: number
  damageType?: DamageTypeId
}

export default function GMDamageForm({ rawDamage, realDamage, damageType }: GMDamageScreenProps) {
  const actions = useDamageFormActions()
  return (
    <DrawerPage>
      <ScrollSection style={{ flex: 1 }} title="entrées de dégâts">
        <Row>
          <Col style={{ flex: 1 }}>
            <Txt>Dég. bruts : </Txt>
            <TxtInput readOnly editable={false} value={rawDamage?.toString() ?? ""} />
          </Col>
          <Spacer x={layout.globalPadding} />
          <Col style={{ flex: 1 }}>
            <Txt>Dég. réels :</Txt>
            <TxtInput readOnly editable={false} value={realDamage?.toString() ?? ""} />
          </Col>
          <Spacer x={layout.globalPadding} />
          <Col style={{ flex: 1 }}>
            <Txt>Type :</Txt>
            <TxtInput readOnly editable={false} value={damageType} />
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
