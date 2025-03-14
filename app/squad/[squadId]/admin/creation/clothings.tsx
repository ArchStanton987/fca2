import { useState } from "react"
import { Pressable, View } from "react-native"

import { knowledgesList } from "lib/character/abilities/knowledges/knowledges"
import { secAttrArray } from "lib/character/abilities/sec-attr/sec-attr"
import { skillsArray } from "lib/character/abilities/skills/skills"
import { specialArray } from "lib/character/abilities/special/special"
import { combatModsArray } from "lib/character/combat/combat-mods"
import { ChangeableAttribute, DbSymptoms, Operation } from "lib/character/effects/symptoms.type"
import { BodyPart, DbBodyParts } from "lib/character/health/health-types"
import { ClothingId, ClothingType } from "lib/objects/data/clothings/clothings.types"
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
const defaultClothingForm = {
  id: "",
  label: "",
  type: "light",
  armorClass: "0",
  threshold: "0",
  physicalDamageResist: "2",
  laserDamageResist: "2",
  plasmaDamageResist: "2",
  fireDamageResist: "2",
  protects: { head: false, torso: true, arms: false, groin: false, legs: false },
  malus: "-0",
  place: "1",
  weight: "1",
  value: "10"
} as const
type NewSymptom = {
  key: string
  attrType: AttributeType
  attrId: ChangeableAttribute
  operation: Operation
  value: string
}

const clothingsTypes: ClothingType[] = ["light", "medium", "heavy", "carry"]
const resistances: { label: string; key: keyof typeof defaultClothingForm }[] = [
  { label: "PHY", key: "physicalDamageResist" },
  { label: "LAS", key: "laserDamageResist" },
  { label: "PLA", key: "plasmaDamageResist" },
  { label: "FEU", key: "fireDamageResist" }
] as const
const operationCycle: Operation[] = ["add", "mult", "abs"]
const attributesTypes: AttributeType[] = ["special", "secAttr", "skills", "combatMod", "knowledges"]
type Displays = "attributes"

type ClothingForm = {
  id: string
  label: string
  type: ClothingType
  armorClass: string
  threshold: string
  physicalDamageResist: string
  laserDamageResist: string
  plasmaDamageResist: string
  fireDamageResist: string
  protects: { [key in BodyPart]: boolean }
  malus: string
  place: string
  weight: string
  value: string
}

export default function ClothingsCreation() {
  const useCases = useGetUseCases()

  const [currDisplay, setCurrDisplay] = useState<Displays | null>("attributes")
  const [lastSelectedCat, setLastSelectedCat] = useState<keyof typeof attributesMap>("special")
  const [selectedSymptom, setSelectedSymptom] = useState("")
  const [clothingForm, setClothingForm] = useState<ClothingForm>(defaultClothingForm)
  const [symptoms, setSymptoms] = useState<NewSymptom[]>([])
  const [newSymptomKey, setNewSymptomKey] = useState(0)

  const handleSetForm = (key: keyof typeof defaultClothingForm, value: any) => {
    setClothingForm({ ...clothingForm, [key]: value })
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
    const newCloth = {
      ...clothingForm,
      id: clothingForm.id as ClothingId,
      armorClass: parseInt(clothingForm.armorClass, 10),
      threshold: parseInt(clothingForm.armorClass, 10),
      physicalDamageResist: parseInt(clothingForm.physicalDamageResist, 10),
      laserDamageResist: parseInt(clothingForm.laserDamageResist, 10),
      plasmaDamageResist: parseInt(clothingForm.plasmaDamageResist, 10),
      fireDamageResist: parseInt(clothingForm.fireDamageResist, 10),
      protects: Object.entries(clothingForm.protects).reduce((acc, [key, value]) => {
        if (!value) return acc
        return { ...acc, [key]: key }
      }, {} as DbBodyParts),
      malus: parseInt(clothingForm.malus, 10),
      place: parseInt(clothingForm.place, 10),
      weight: parseInt(clothingForm.weight, 10),
      value: parseInt(clothingForm.value, 10),
      symptoms: symptoms.reduce((acc, symptom) => {
        const { attrType, attrId, operation, value } = symptom
        const newSymptom = { id: attrId, operation, value: parseInt(value, 10) }
        return { ...acc, [attrType]: newSymptom }
      }, {} as DbSymptoms)
    }

    try {
      await useCases.additional.addClothing(newCloth)
      Toast.show({ type: "custom", text1: "L'objet a été ajouté" })
    } catch (err: any) {
      Toast.show({ type: "error", text1: "Erreur lors de la création de l'objet" })
    }
  }

  return (
    <DrawerPage>
      <ScrollSection style={{ flex: 1 }} title="Formulaire">
        <Row>
          <Col style={{ flex: 1 }}>
            <Txt>ID</Txt>
            <TxtInput value={clothingForm.id} onChangeText={e => handleSetForm("id", e)} />
          </Col>
          <Spacer x={layout.globalPadding} />
          <Col style={{ flex: 1 }}>
            <Txt>LABEL</Txt>
            <TxtInput value={clothingForm.label} onChangeText={e => handleSetForm("label", e)} />
          </Col>
        </Row>

        <Spacer y={15} />

        <Txt>TYPE</Txt>
        <Spacer y={layout.globalPadding} />
        <List
          horizontal
          data={clothingsTypes}
          style={{ justifyContent: "space-between" }}
          keyExtractor={item => item}
          renderItem={({ item }) => (
            <SelectorButton
              onPress={() => handleSetForm("type", item)}
              isSelected={clothingForm.type === item}
              label={item}
            />
          )}
        />

        <Spacer y={15} />

        <Row>
          <Col style={{ flex: 1 }}>
            <Txt>CLASSE D&apos;ARMURE</Txt>
            <TxtInput
              value={clothingForm.armorClass}
              onChangeText={e => handleSetForm("armorClass", e)}
            />
          </Col>
          <Spacer x={layout.globalPadding} />

          <Col style={{ flex: 1 }}>
            <Txt>SEUIL DEGATS</Txt>
            <TxtInput
              value={clothingForm.threshold}
              onChangeText={e => handleSetForm("threshold", e)}
            />
          </Col>
        </Row>

        <Spacer y={15} />

        <List
          horizontal
          data={resistances}
          keyExtractor={item => item.key}
          separator={<Spacer x={layout.globalPadding} />}
          renderItem={({ item }) => (
            <Col style={{ flex: 1 }}>
              <Txt>{item.label}</Txt>
              <TxtInput
                value={String(clothingForm[item.key])}
                onChangeText={e => handleSetForm(item.key, e)}
              />
            </Col>
          )}
        />

        <Spacer y={15} />

        <Txt>PROTEGE</Txt>
        <Spacer y={5} />
        <List
          horizontal
          data={Object.entries(clothingForm.protects)}
          keyExtractor={item => item[0]}
          style={{ justifyContent: "space-between" }}
          separator={<Spacer x={layout.globalPadding} />}
          renderItem={({ item }) => (
            <SelectorButton
              onPress={() =>
                handleSetForm("protects", { ...clothingForm.protects, [item[0]]: !item[1] })
              }
              isSelected={item[1]}
              label={item[0]}
            />
          )}
        />

        <Spacer y={15} />

        <List
          horizontal
          data={["malus", "place", "weight", "value"]}
          keyExtractor={item => item}
          style={{ justifyContent: "space-between" }}
          separator={<Spacer x={layout.globalPadding} />}
          renderItem={({ item }) => (
            <Col style={{ flex: 1 }}>
              <Txt>{item}</Txt>
              <TxtInput
                value={String(clothingForm[item as keyof typeof clothingForm])}
                onChangeText={e => handleSetForm(item as keyof typeof clothingForm, e)}
              />
            </Col>
          )}
        />

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
