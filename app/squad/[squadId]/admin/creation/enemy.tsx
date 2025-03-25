import { useState } from "react"
import { View } from "react-native"

import { limbsDefault } from "lib/character/health/health"
import { DbStatus } from "lib/character/status/status.types"
import beasts from "lib/enemy/const/beasts"
import humanTemplates from "lib/enemy/const/human-templates"
import robots from "lib/enemy/const/robots"
import { DbEnemy } from "lib/enemy/enemy.types"
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

const enemyMap = {
  human: Object.keys(humanTemplates).map(h => ({ id: h, label: h })),
  robot: Object.values(robots).map(r => ({ id: r.id, label: r.label })),
  animal: Object.values(beasts).map(b => ({ id: b.id, label: b.label }))
}

type EnemyType = "human" | "robot" | "animal"
const enemyTypes = ["human", "robot", "animal"] as const
const defaultForm = {
  enemyType: "human",
  template: "gunner",
  description: "",
  name: "",
  level: ""
} as const

type Form = {
  enemyType: EnemyType
  description?: string
  name: string
  template: keyof typeof humanTemplates | keyof typeof robots | keyof typeof beasts
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
    if (form.enemyType === "human") return
    const bestiary = { human: humanTemplates, robot: robots, animal: beasts }
    const template = bestiary[form.enemyType][form.template]
    const status: DbStatus = {
      background: "other",
      currAp: template.actionPoints,
      exp: 1,
      level: Number.isNaN(parseInt(form.level, 10)) ? 1 : parseInt(form.level, 10),
      ...limbsDefault,
      rads: 0
    }
    const payload: DbEnemy = { ...template, status, ...form }
    try {
      await useCases.enemy.create({ data: payload })
      Toast.show({ type: "custom", text1: "L'ennemi a été créé" })
      setForm(defaultForm)
    } catch (err) {
      Toast.show({ type: "error", text1: "Erreur lors de la création de l'ennemi" })
    }
  }

  const templateList = enemyMap[form.enemyType]

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
            <TxtInput value={form.template} />
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
            data={templateList}
            keyExtractor={item => item.id}
            separator={<Spacer y={10} />}
            renderItem={({ item }) => (
              <Txt onPress={() => handleSetForm("template", item.id)}>{item.label}</Txt>
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
