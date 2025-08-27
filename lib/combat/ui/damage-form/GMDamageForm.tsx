import { StyleSheet } from "react-native"

import { DamageTypeId } from "lib/objects/data/weapons/weapons.types"
import Toast from "react-native-toast-message"

import Col from "components/Col"
import DrawerPage from "components/DrawerPage"
import List from "components/List"
import Row from "components/Row"
import Section from "components/Section"
import ScrollSection from "components/Section/ScrollSection"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import TxtInput from "components/TxtInput"
import PlusIcon from "components/icons/PlusIcon"
import { useCombat } from "providers/CombatProvider"
import { useDamageFormActions, useDamageFormStore } from "providers/DamageFormProvider"
import { useGetUseCases } from "providers/UseCasesProvider"
import PlayButton from "screens/CombatScreen/slides/PlayButton"
import layout from "styles/layout"

import DamageEntry from "./DamageEntry"
import DamageFormListPicker from "./DamageFormListPicker"

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
  const useCases = useGetUseCases()
  const { combat } = useCombat()
  const entries = useDamageFormStore(state => state.entries)
  const actions = useDamageFormActions()

  const submit = async () => {
    if (combat === null) return
    try {
      const healthChangeEntries = Object.keys(entries).length === 0 ? false : entries
      await useCases.combat.updateAction({ combat, payload: { healthChangeEntries } })
      Toast.show({ type: "custom", text1: "Dégâts enregistrés !" })
      actions.clear()
    } catch (err) {
      Toast.show({ type: "error", text1: "Erreur lors de l'enregistrement des dégâts" })
    }
  }

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

        <List
          data={Object.entries(entries).map(([id, value]) => ({ id, ...value }))}
          keyExtractor={e => e.id}
          separator={<Spacer y={15} />}
          renderItem={({ item }) => <DamageEntry id={parseInt(item.id, 10)} />}
        />
      </ScrollSection>

      <Spacer x={layout.globalPadding} />

      <Col style={{ width: 100 }}>
        <ScrollSection style={{ flex: 1 }}>
          <DamageFormListPicker />
        </ScrollSection>

        <Spacer y={layout.globalPadding} />

        <Section title="valider" contentContainerStyle={styles.submitSection}>
          <PlayButton onPress={() => submit()} />
        </Section>
      </Col>
    </DrawerPage>
  )
}
