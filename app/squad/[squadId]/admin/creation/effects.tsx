import { useState } from "react"
import { Pressable, View } from "react-native"

import { knowledgesList } from "lib/character/abilities/knowledges/knowledges"
import { secAttrArray } from "lib/character/abilities/sec-attr/sec-attr"
import { skillsArray } from "lib/character/abilities/skills/skills"
import { specialArray } from "lib/character/abilities/special/special"
import { DbEffectData, EffectType } from "lib/character/effects/effects.types"
import { ChangeableAttribute, DbSymptoms, Operation } from "lib/character/effects/symptoms.type"
import { combatModsArray } from "lib/combat/combat-mods"
import Toast from "react-native-toast-message"

import Col from "components/Col"
import DeleteInput from "components/DeleteInput"
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

const attributesMap = {
  special: { label: "SPECIAL", map: specialArray },
  secAttr: { label: "Sec.", map: secAttrArray },
  skills: { label: "Skills", map: skillsArray },
  combatMod: { label: "CmbtMod", map: combatModsArray },
  knowledges: { label: "Know.", map: knowledgesList }
}
type AttributeType = keyof typeof attributesMap

const defaultSymptom: NewSymptom = {
  key: "0",
  attrType: "special",
  attrId: "perception",
  operation: "add",
  value: "1"
}

type EffectForm = {
  id: string
  type: EffectType
  label: string
  length: string // can be null in db
  description: string
  nextEffectId: string // can be null in db
}

const defaultForm = {
  id: "",
  label: "",
  type: "other",
  length: "",
  description: "",
  nextEffectId: ""
} as const

type NewSymptom = {
  key: string
  attrType: AttributeType
  attrId: ChangeableAttribute
  operation: Operation
  value: string
}
type Displays = "attributes"
const operationCycle: Operation[] = ["add", "mult", "abs"]
const attributesTypes: AttributeType[] = ["special", "secAttr", "skills", "combatMod", "knowledges"]

export default function EffectsCreation() {
  const useCases = useGetUseCases()
  const [currDisplay, setCurrDisplay] = useState<Displays | null>("attributes")
  const [lastSelectedCat, setLastSelectedCat] = useState<keyof typeof attributesMap>("special")
  const [effectForm, setEffectForm] = useState<EffectForm>(defaultForm)
  const [symptoms, setSymptoms] = useState<NewSymptom[]>([])
  const [selectedSymptom, setSelectedSymptom] = useState("")
  const [newSymptomKey, setNewSymptomKey] = useState(0)

  const handleSetForm = <T extends keyof EffectForm>(key: T, value: EffectForm[T]) => {
    setEffectForm(prev => ({ ...prev, [key]: value }))
  }

  const addSymptom = () => {
    setNewSymptomKey(prev => prev + 1)
    const newSymptom = { ...defaultSymptom, key: String(newSymptomKey) }
    setSymptoms(prev => [...prev, newSymptom])
    setSelectedSymptom(newSymptomKey.toString())
  }

  const deleteSymptom = (symptomKey: string) => {
    setSymptoms(prev => prev.filter(symptom => symptom.key !== symptomKey))
  }

  const toggleSymptomOperation = (symptomKey: string) => {
    setSymptoms(prev => {
      const symptom = prev.find(s => s.key === symptomKey)
      if (!symptom) return prev
      const currIndex = operationCycle.indexOf(symptom.operation)
      const newIndex = currIndex === operationCycle.length - 1 ? 0 : currIndex + 1
      const newOperation = operationCycle[newIndex]
      const newSymptom = { ...symptom, operation: newOperation }
      return prev.map(s => (s.key === symptomKey ? newSymptom : s))
    })
    setSelectedSymptom(symptomKey)
  }

  const handleSetSymptom = (
    symptomKey: string,
    key: NewSymptom["attrId"] | NewSymptom["value"],
    value: string
  ) => {
    setSymptoms(prev => {
      const symptom = prev.find(s => s.key === symptomKey)
      if (!symptom) return prev
      const newSymptom = { ...symptom, [key]: value }
      return prev.map(s => (s.key === symptomKey ? newSymptom : s))
    })
  }

  const toggleSymptomAttrType = (symptomKey: string) => {
    setSymptoms(prev => {
      const symptom = prev.find(s => s.key === symptomKey)
      if (!symptom) return prev
      const currIndex = attributesTypes.indexOf(symptom.attrType)
      const newIndex = currIndex === attributesTypes.length - 1 ? 0 : currIndex + 1
      const newAttrType = attributesTypes[newIndex]
      setLastSelectedCat(newAttrType)
      const newSymptom = { ...symptom, attrType: newAttrType }
      return prev.map(s => (s.key === symptomKey ? newSymptom : s))
    })
    setCurrDisplay("attributes")
    setSelectedSymptom(symptomKey)
  }

  const submit = async () => {
    const payload: DbEffectData = {
      ...effectForm,
      length: effectForm.length === "" ? null : parseFloat(effectForm.length),
      symptoms: symptoms.reduce((acc, symptom) => {
        const { attrType, attrId, operation, value } = symptom
        const newSymptom = { id: attrId, operation, value: parseInt(value, 10) }
        return { ...acc, [attrType]: newSymptom }
      }, {} as DbSymptoms)
    }
    try {
      await useCases.additional.addEffect(payload)
      Toast.show({ type: "custom", text1: "L'effet a été ajouté" })
    } catch (err: any) {
      Toast.show({ type: "error", text1: "Erreur lors de la création de l'effet" })
    }
  }

  return (
    <DrawerPage>
      <ScrollSection style={{ flex: 1 }} title="Formulaire">
        <Row>
          <Col style={{ flex: 1 }}>
            <Txt>ID</Txt>
            <TxtInput value={effectForm.id} onChangeText={e => handleSetForm("id", e)} />
          </Col>
          <Spacer x={layout.globalPadding} />
          <Col style={{ flex: 1 }}>
            <Txt>LABEL</Txt>
            <TxtInput value={effectForm.label} onChangeText={e => handleSetForm("label", e)} />
          </Col>
        </Row>

        <Spacer y={15} />

        <Row>
          <Col style={{ flex: 1 }}>
            <Txt>LENGTH</Txt>
            <TxtInput value={effectForm.length} onChangeText={e => handleSetForm("length", e)} />
          </Col>
          <Spacer x={layout.globalPadding} />
          <Col style={{ flex: 1 }}>
            <Txt>NEXT EFF ID</Txt>
            <TxtInput
              value={effectForm.nextEffectId}
              onChangeText={e => handleSetForm("nextEffectId", e)}
            />
          </Col>
        </Row>

        <Spacer y={15} />

        <Col style={{ flex: 1 }}>
          <Txt>DESCRIPTION</Txt>
          <TxtInput
            value={effectForm.description}
            onChangeText={e => handleSetForm("description", e)}
            multiline
          />
        </Col>

        <Spacer y={15} />

        <Row style={{ alignItems: "center" }}>
          <Txt>SYMPTOMES</Txt>
          <Spacer x={20} />
          <PlusIcon size={30} onPress={addSymptom} />
        </Row>
        <Spacer y={5} />
        <List
          data={symptoms}
          keyExtractor={item => item.key}
          separator={<Spacer y={10} />}
          renderItem={({ item }) => (
            <Row>
              <Col>
                <Txt>CALC</Txt>
                <SelectorButton
                  onPress={() => toggleSymptomOperation(item.key)}
                  label={item.operation}
                  isSelected={false}
                />
              </Col>
              <Spacer x={layout.globalPadding} />
              <Col>
                <Txt>TYPE ATTR</Txt>
                <SelectorButton
                  onPress={() => toggleSymptomAttrType(item.key)}
                  label={item.attrType}
                  isSelected={false}
                />
              </Col>
              <Spacer x={layout.globalPadding} />
              <Col style={{ flex: 1 }}>
                <Txt>ATTR</Txt>
                <TxtInput
                  value={item.attrId}
                  onChangeText={e => handleSetSymptom(item.key, "attrId", e)}
                />
              </Col>
              <Spacer x={layout.globalPadding} />
              <Col style={{ flex: 1 }}>
                <Txt>VALEUR</Txt>
                <TxtInput
                  value={item.value}
                  onChangeText={e => handleSetSymptom(item.key, "value", e)}
                />
              </Col>
              <DeleteInput onPress={() => deleteSymptom(item.key)} isSelected />
            </Row>
          )}
        />
        <Spacer y={80} />
      </ScrollSection>

      <Spacer x={layout.globalPadding} />

      <View style={{ width: 160 }}>
        <ScrollSection style={{ flex: 1 }} title="Attributs">
          {currDisplay === "attributes" ? (
            <List
              data={Object.values(attributesMap[lastSelectedCat].map)}
              keyExtractor={item => item.id}
              separator={<Spacer y={10} />}
              renderItem={({ item }) => (
                <Pressable onPress={() => handleSetSymptom(selectedSymptom, "attrId", item.id)}>
                  <Txt>{item.label}</Txt>
                </Pressable>
              )}
            />
          ) : null}
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
