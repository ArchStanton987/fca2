import { useState } from "react"
import { View } from "react-native"

import { limbsDefault } from "lib/character/health/health"
import { DbCharMeta, species } from "lib/character/meta/meta"
import { BackgroundId, DbStatus } from "lib/character/status/status.types"
import enemyTemplates from "lib/enemy/const/enemy-templates"
import { generateDbHuman } from "lib/enemy/utils/enemy-generation"
import Toast from "react-native-toast-message"

import Col from "components/Col"
import DrawerPage from "components/DrawerPage"
import List from "components/List"
import Row from "components/Row"
import Section from "components/Section"
import ScrollSection from "components/Section/ScrollSection"
import SelectorButton from "components/SelectorButton"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import TxtInput from "components/TxtInput"
import PlusIcon from "components/icons/PlusIcon"
import { useSquad } from "contexts/SquadContext"
import { useGetUseCases } from "providers/UseCasesProvider"
import layout from "styles/layout"

const enemyTypes = Object.keys(enemyTemplates) as ReadonlyArray<keyof typeof enemyTemplates>

type EnemyForm = {
  speciesId: (typeof enemyTypes)[number]
  templateId: string
  background: BackgroundId
  squadId: string
  firstname: string
  lastname: string
  description?: string
  level: string
}

export default function EnemyCreation() {
  const useCases = useGetUseCases()
  const { squadId } = useSquad()

  const defaultForm: EnemyForm = {
    speciesId: "human",
    templateId: "gunner",
    background: "other",
    squadId,
    description: "",
    firstname: "",
    lastname: "",
    level: ""
  }

  const [form, setForm] = useState(defaultForm)

  const handleSetForm = <T extends keyof EnemyForm>(key: T, value: EnemyForm[T]) => {
    setForm({ ...form, [key]: value })
  }

  const toggleType = () => {
    const currIndex = enemyTypes.indexOf(form.speciesId)
    const nextIndex = (currIndex + 1) % enemyTypes.length
    const newType = enemyTypes[nextIndex]
    handleSetForm("speciesId", newType)
    handleSetForm("templateId", enemyTemplates[newType][0].templateId)
    if (newType === "human") return
    handleSetForm("lastname", "")
  }

  const submit = async () => {
    let payload
    const { level, ...rest } = form
    const finalLevel = Number.isNaN(parseInt(level, 10)) ? 1 : parseInt(level, 10)
    const meta: DbCharMeta = { ...rest, id: "" }
    if (form.speciesId === "human") {
      payload = { ...generateDbHuman(finalLevel, form.templateId), meta }
    } else {
      const template = enemyTemplates[form.speciesId][form.templateId]
      const status: DbStatus = {
        background: form.background,
        currAp: template.actionPoints,
        exp: 1,
        level: 1,
        ...limbsDefault,
        rads: 0
      }
      payload = { meta, status }
    }
    try {
      await useCases.enemy.create(payload)
      Toast.show({ type: "custom", text1: "L'ennemi a été créé" })
      setForm(defaultForm)
    } catch (err) {
      console.log("err", err)
      Toast.show({ type: "error", text1: "Erreur lors de la création de l'ennemi" })
    }
  }

  return (
    <DrawerPage>
      <ScrollSection style={{ flex: 1 }} title={species[form.speciesId]}>
        <Row>
          <Col>
            <Txt>TYPE</Txt>
            <SelectorButton
              isSelected={false}
              onPress={toggleType}
              label={species[form.speciesId]}
            />
          </Col>
          <Spacer x={layout.globalPadding} />
          <Col style={{ flex: 1 }}>
            <Txt>FIRSTNAME</Txt>
            <TxtInput value={form.firstname} onChangeText={e => handleSetForm("firstname", e)} />
            {form.speciesId === "human" ? (
              <>
                <Spacer x={layout.globalPadding} />
                <Txt>LASTNAME</Txt>
                <TxtInput value={form.lastname} onChangeText={e => handleSetForm("lastname", e)} />
              </>
            ) : null}
          </Col>
          <Spacer x={layout.globalPadding} />
          <Col style={{ flex: 1 }}>
            <Txt>TEMPLATE</Txt>
            <Txt>{form.templateId}</Txt>
          </Col>
          <Spacer x={layout.globalPadding} />
          {form.speciesId === "human" ? (
            <Col style={{ flex: 1 }}>
              <Txt>LEVEL</Txt>
              <TxtInput value={form.level} onChangeText={e => handleSetForm("level", e)} />
            </Col>
          ) : (
            <Spacer fullspace />
          )}
        </Row>

        <Spacer y={15} />

        <Txt>DESCRIPTION</Txt>
        <TxtInput
          value={form.description}
          onChangeText={e => handleSetForm("description", e)}
          multiline
        />
      </ScrollSection>

      <Spacer x={layout.globalPadding} />

      <View style={{ width: 160 }}>
        <ScrollSection style={{ flex: 1 }} title="template">
          <List
            data={Object.values(enemyTemplates[form.speciesId])}
            keyExtractor={item => item.templateId}
            separator={<Spacer y={10} />}
            renderItem={({ item }) => (
              <Txt onPress={() => handleSetForm("templateId", item.templateId)}>{item.label}</Txt>
            )}
          />
        </ScrollSection>

        <Spacer y={layout.globalPadding} />

        <Section title="enregistrer">
          <View style={{ alignItems: "center" }}>
            <PlusIcon onPress={() => submit()} />
          </View>
        </Section>
      </View>
    </DrawerPage>
  )
}
