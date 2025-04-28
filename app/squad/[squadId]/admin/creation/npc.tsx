import { useState } from "react"
import { View } from "react-native"

import { limbsDefault } from "lib/character/health/health"
import { DbCharMeta, species } from "lib/character/meta/meta"
import { BackgroundId, DbStatus } from "lib/character/status/status.types"
import enemyTemplates from "lib/npc/const/npc-templates"
import { generateDbHuman } from "lib/npc/utils/npc-generation"
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
  isEnemy: boolean
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
    level: "",
    isEnemy: true
  }

  const [form, setForm] = useState(defaultForm)

  const handleSetForm = <T extends keyof EnemyForm>(key: T, value: EnemyForm[T]) => {
    setForm({ ...form, [key]: value })
  }

  const toggleType = () => {
    const currIndex = enemyTypes.indexOf(form.speciesId)
    const nextIndex = (currIndex + 1) % enemyTypes.length
    const newType = enemyTypes[nextIndex]
    const templateKeys = Object.keys(enemyTemplates[newType])
    const randomIndex = Math.floor(Math.random() * templateKeys.length)
    const newTemplateId = templateKeys[randomIndex]
    const newLastName = newType === "human" ? form.lastname : ""
    setForm(prev => ({
      ...prev,
      speciesId: newType,
      templateId: newTemplateId,
      lastname: newLastName
    }))
  }

  const submit = async () => {
    let payload
    const { level, ...rest } = form
    const finalLevel = Number.isNaN(parseInt(level, 10)) ? 1 : parseInt(level, 10)
    const meta: DbCharMeta = { isNpc: true, ...rest }
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
      await useCases.npc.create(payload)
      Toast.show({ type: "custom", text1: "L'ennemi a été créé" })
      setForm(defaultForm)
    } catch (err) {
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
            <Txt>{enemyTemplates[form.speciesId][form.templateId].label}</Txt>
          </Col>
          <Spacer x={layout.globalPadding} />
          <Col style={{ flex: 1 }}>
            <Txt>HOSTILE</Txt>
            <SelectorButton
              isSelected={false}
              onPress={() => handleSetForm("isEnemy", !form.isEnemy)}
              label={form.isEnemy ? "ENEMY" : "ALLY"}
            />
            {form.speciesId === "human" ? (
              <>
                <Txt>LEVEL</Txt>
                <TxtInput value={form.level} onChangeText={e => handleSetForm("level", e)} />
              </>
            ) : null}
          </Col>
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
