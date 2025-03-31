import { useState } from "react"
import { View } from "react-native"

import { limbsDefault } from "lib/character/health/health"
import { DbStatus } from "lib/character/status/status.types"
import beasts from "lib/enemy/const/beasts"
import enemyTemplates from "lib/enemy/const/enemy-templates"
import humanTemplates from "lib/enemy/const/human-templates"
import robots from "lib/enemy/const/robots"
import { EnemyType } from "lib/enemy/enemy.types"
import { generateDbChar } from "lib/enemy/utils/enemy-generation"
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
import { useGetUseCases } from "providers/UseCasesProvider"
import layout from "styles/layout"

const enemyTypes = ["human", "robot", "animal"] as const
const defaultForm = {
  enemyType: "human",
  templateId: "gunner",
  description: "",
  name: "",
  level: ""
} as const

type Form = {
  enemyType: EnemyType
  description?: string
  name: string
  templateId: keyof typeof humanTemplates | keyof typeof robots | keyof typeof beasts
  level: string
}

export default function EnemyCreation() {
  const useCases = useGetUseCases()

  const [form, setForm] = useState<Form>(defaultForm)

  const handleSetForm = (key: keyof Form, value: string) => {
    setForm({ ...form, [key]: value })
  }

  const toggleType = () => {
    const currIndex = enemyTypes.indexOf(form.enemyType)
    const nextIndex = (currIndex + 1) % enemyTypes.length
    handleSetForm("enemyType", enemyTypes[nextIndex])
  }

  const submit = async () => {
    let payload
    const finalLevel = Number.isNaN(parseInt(form.level, 10)) ? 1 : parseInt(form.level, 10)
    if (form.enemyType === "human") {
      payload = generateDbChar(finalLevel, form.templateId)
    } else {
      const template = enemyTemplates[form.enemyType][form.templateId]
      const status: DbStatus = {
        background: "other",
        currAp: template.actionPoints,
        exp: 1,
        level: 1,
        ...limbsDefault,
        rads: 0
      }
      payload = { ...template, status }
    }
    const common = {
      enemyType: form.enemyType,
      name: form.name,
      templateId: form.templateId,
      description: form.description
    }
    payload = { ...payload, ...common }

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
      <ScrollSection style={{ flex: 1 }} title={form.enemyType}>
        <Row>
          <Col>
            <Txt>TYPE</Txt>
            <SelectorButton isSelected={false} onPress={toggleType} label={form.enemyType} />
          </Col>
          <Spacer x={layout.globalPadding} />
          <Col style={{ flex: 1 }}>
            <Txt>NAME</Txt>
            <TxtInput value={form.name} onChangeText={e => handleSetForm("name", e)} />
          </Col>
          <Spacer x={layout.globalPadding} />
          <Col style={{ flex: 1 }}>
            <Txt>TEMPLATE</Txt>
            <TxtInput value={form.templateId} />
          </Col>
          <Spacer x={layout.globalPadding} />
          {form.enemyType === "human" ? (
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
            data={Object.values(enemyTemplates[form.enemyType])}
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
