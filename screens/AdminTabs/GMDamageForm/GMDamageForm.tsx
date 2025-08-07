import { useState } from "react"
import { StyleSheet } from "react-native"

import { limbsMap } from "lib/character/health/health"
import { LimbsHp } from "lib/character/health/health-types"
import { DamageTypeId } from "lib/objects/data/weapons/weapons.types"
import Toast from "react-native-toast-message"

import Col from "components/Col"
import DrawerPage from "components/DrawerPage"
import List from "components/List"
import Row from "components/Row"
import Section from "components/Section"
import ScrollSection from "components/Section/ScrollSection"
import Selectable from "components/Selectable"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import TxtInput from "components/TxtInput"
import HealthChangeEntry from "components/UpdateHealth/HealthChangeEntry"
import PlusIcon from "components/icons/PlusIcon"
import { useCombat } from "providers/CombatProvider"
import { useDamageForm, useDamageFormApi } from "providers/DamageFormProvider"
import { useGetUseCases } from "providers/UseCasesProvider"
import PlayButton from "screens/CombatScreen/slides/PlayButton"
import layout from "styles/layout"

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

type Pannel = "char" | "localization"

type GMDamageScreenProps = {
  rawDamage?: number
  realDamage?: number
  damageType?: DamageTypeId
}

export default function GMDamageForm({ rawDamage, realDamage, damageType }: GMDamageScreenProps) {
  const useCases = useGetUseCases()
  const { combat, players, npcs } = useCombat()
  const contenders = { ...players, ...npcs }
  const charList = Object.values(contenders).map(c => ({
    id: c.char.charId,
    name: c.char.fullname
  }))
  const form = useDamageForm()
  const entries = Object.entries(form).map(([id, val]) => ({ id, ...val }))

  const { add, setEntry, reset } = useDamageFormApi()

  const [selectedPannel, setSelectedPannel] = useState<Pannel>("char")
  const defaultSelectedEntry = entries.length > 0 ? entries[0].id : null
  const [selectedEntry, setSelectedEntry] = useState<string | null>(defaultSelectedEntry)

  const setLoc = (value: keyof LimbsHp) => {
    if (!selectedEntry) return
    setEntry(selectedEntry, { localization: value })
  }
  const setChar = (value: string) => {
    if (!selectedEntry) return
    setEntry(selectedEntry, { charId: value })
  }

  const submit = async () => {
    if (combat === null) {
      Toast.show({ type: "error", text1: "combat context could not be found" })
      return
    }
    try {
      await useCases.combat.updateAction({ combat, payload: { healthChangeEntries: form } })
      Toast.show({ type: "custom", text1: "Dégâts enregistrés !" })
      reset()
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
          <PlusIcon size={40} onPress={add} />
        </Row>

        <List
          data={entries}
          keyExtractor={e => e.id}
          separator={<Spacer y={15} />}
          renderItem={({ item }) => {
            const isSelected = item.id === selectedEntry
            return (
              <HealthChangeEntry
                entry={item}
                isSelected={isSelected}
                selectEntry={() => setSelectedEntry(item.id)}
                onPressLocalization={() => setSelectedPannel("localization")}
                onPressChar={() => setSelectedPannel("char")}
              />
            )
          }}
        />
      </ScrollSection>

      <Spacer x={layout.globalPadding} />

      <Col style={{ width: 100 }}>
        <ScrollSection style={{ flex: 1 }}>
          {selectedPannel === "char" ? (
            <List
              data={charList}
              keyExtractor={e => e.id}
              renderItem={({ item }) => (
                <Selectable isSelected={false} onPress={() => setChar(item.id)}>
                  <Txt>{item.name}</Txt>
                </Selectable>
              )}
            />
          ) : (
            <List
              data={Object.values(limbsMap)}
              keyExtractor={e => e.id}
              renderItem={({ item }) => (
                <Selectable isSelected={false} onPress={() => setLoc(item.id)}>
                  <Txt>{item.label}</Txt>
                </Selectable>
              )}
            />
          )}
        </ScrollSection>

        <Spacer y={layout.globalPadding} />

        <Section title="valider" contentContainerStyle={styles.submitSection}>
          <PlayButton onPress={() => submit()} />
        </Section>
      </Col>
    </DrawerPage>
  )
}
