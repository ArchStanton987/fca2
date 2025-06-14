import { useState } from "react"
import { Pressable, View } from "react-native"

import { KnowledgeId } from "lib/character/abilities/knowledges/knowledge-types"
import { knowledgesList } from "lib/character/abilities/knowledges/knowledges"
import { skillsArray } from "lib/character/abilities/skills/skills"
import { effectsArray } from "lib/character/effects/effects"
import { DbModifiers, Modifier, Operation } from "lib/character/effects/symptoms.type"
import {
  ConsumableId,
  ConsumableType,
  DbConsumableData
} from "lib/objects/data/consumables/consumables.types"
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
import { useAdditionalElements } from "contexts/AdditionalElementsContext"
import { useGetUseCases } from "providers/UseCasesProvider"
import colors from "styles/colors"
import layout from "styles/layout"

type ReplaceNumberWithString<T> = {
  [K in keyof T]: T[K] extends number ? string : T[K]
}
type ConsumableFormType = ReplaceNumberWithString<
  Omit<DbConsumableData, "tags" | "knowledges" | "modifiers"> & {
    id: string
  }
>

type DbTags = Record<ConsumableType, ConsumableType>
type DbKnowledges = Record<KnowledgeId, KnowledgeId>
type StateModifier = ReplaceNumberWithString<Modifier>
type StateModifiers = Record<string, StateModifier>
type Displays = "knowledges" | "effects" | "skills"

const defaultForm: ConsumableFormType = {
  id: "" as ConsumableId,
  label: "",
  effectId: undefined,
  challengeLabel: undefined,
  od: false,
  addict: false,
  value: "150",
  place: "0.15",
  weight: "0.08",
  description: "",
  maxUsage: "1",
  skillId: undefined
}

const defaultModifier = { id: "rads", value: "0", operation: "add" } as const
const consumableTypes: ConsumableType[] = ["heal", "kit", "drugs"]
const operationCycle: Operation[] = ["add", "mult", "abs"]

export default function ConsumablesCreation() {
  const useCases = useGetUseCases()
  const additionalElements = useAdditionalElements()
  const [currDisplay, setCurrDisplay] = useState<Displays | null>(null)
  const [consumableForm, setConsumableForm] = useState<ConsumableFormType>(defaultForm)
  const [tags, setTags] = useState({} as DbTags)
  const [knowledges, setKnowledges] = useState({} as DbKnowledges)
  const [modifiers, setModifiers] = useState({} as StateModifiers)

  const handleSetForm = (key: keyof typeof defaultForm, value: any) => {
    setConsumableForm({ ...consumableForm, [key]: value })
  }

  const handleSetKnowledge = (k: KnowledgeId) => {
    setKnowledges({ ...knowledges, [k]: k })
  }

  const toggleTag = (tag: ConsumableType) => {
    if (tag in tags) {
      setTags(prev => {
        const newTags = { ...prev }
        delete newTags[tag]
        return newTags
      })
      return
    }
    setTags({ ...tags, [tag]: tag })
  }

  const hasModifier = Object.keys(modifiers).length > 0

  const addModifier = () => {
    if (hasModifier) return
    setModifiers({ ...modifiers, rads: defaultModifier })
  }

  const deleteModifier = () => {
    if (!hasModifier) return
    setModifiers({} as StateModifiers)
  }

  const handleModifier = <T extends keyof Omit<StateModifier, "id">>(
    key: T,
    value: StateModifier[T]
  ) => {
    if (!hasModifier) return
    setModifiers({ ...modifiers, rads: { ...modifiers.rads, [key]: value } })
  }

  const toggleModifierOperation = () => {
    if (!hasModifier) return
    const currIndex = operationCycle.indexOf(modifiers.rads.operation)
    const newIndex = currIndex === operationCycle.length - 1 ? 0 : currIndex + 1
    const newOperation = operationCycle[newIndex]
    handleModifier("operation", newOperation)
  }

  const submit = async () => {
    const newModifiers = Object.values(modifiers).reduce((acc, curr) => {
      acc[curr.id] = { ...curr, value: parseInt(curr.value, 10) }
      return acc
    }, {} as DbModifiers)
    const payload: DbConsumableData = {
      ...consumableForm,
      value: parseInt(consumableForm.value, 10),
      place: parseFloat(consumableForm.place),
      weight: parseFloat(consumableForm.weight),
      maxUsage: parseInt(consumableForm.maxUsage, 10),
      tags,
      knowledges,
      modifiers: newModifiers
    }
    try {
      await useCases.additional.addConsumable(JSON.parse(JSON.stringify(payload)))
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
            <TxtInput value={consumableForm.id} onChangeText={e => handleSetForm("id", e)} />
          </Col>
          <Spacer x={layout.globalPadding} />
          <Col style={{ flex: 1 }}>
            <Txt>LABEL</Txt>
            <TxtInput value={consumableForm.label} onChangeText={e => handleSetForm("label", e)} />
          </Col>
        </Row>

        <Spacer y={15} />

        <Row>
          <Col style={{ flex: 1 }}>
            <Txt>EFFECT ID</Txt>
            <TxtInput
              value={consumableForm.effectId ?? ""}
              onFocus={() => setCurrDisplay("effects")}
              onChangeText={e => handleSetForm("effectId", e)}
            />
          </Col>
          <Spacer x={layout.globalPadding} />
          <Col style={{ flex: 1 }}>
            <Txt>SKILL ID</Txt>
            <TxtInput
              value={consumableForm.skillId ?? ""}
              onChangeText={e => handleSetForm("skillId", e)}
              onFocus={() => setCurrDisplay("skills")}
            />
          </Col>
          <Spacer x={layout.globalPadding} />
          <Col style={{ flex: 1 }}>
            <Txt>CHALLENGE LABEL</Txt>
            <TxtInput
              value={consumableForm.challengeLabel ?? ""}
              onChangeText={e => handleSetForm("challengeLabel", e)}
              placeholder="ex: 5D6+1"
              placeholderTextColor={colors.primColor}
            />
          </Col>
          <Spacer x={layout.globalPadding} />
          <Col style={{ flex: 1 }}>
            <Txt>KNOWLEDGE ID</Txt>
            <TxtInput
              onFocus={() => setCurrDisplay("knowledges")}
              value={Object.keys(knowledges).join() ?? ""}
              onChangeText={e => handleSetKnowledge(e as KnowledgeId)}
            />
          </Col>
        </Row>

        <Spacer y={15} />

        <Row>
          <Col style={{ flex: 1 }}>
            <Txt>OD</Txt>
            <TxtInput
              value={typeof consumableForm.od === "number" ? String(consumableForm.od) : ""}
              onChangeText={e => handleSetForm("effectId", e)}
              placeholder="2"
              placeholderTextColor={colors.primColor}
            />
          </Col>
          <Spacer x={layout.globalPadding} />
          <Col style={{ flex: 1 }}>
            <Txt>ADDICT (ex: 5-24)</Txt>
            <TxtInput
              value={typeof consumableForm.addict === "string" ? consumableForm.addict : ""}
              onChangeText={e => handleSetForm("challengeLabel", e)}
              placeholder="5-24"
              placeholderTextColor={colors.primColor}
            />
          </Col>
        </Row>

        <Spacer y={15} />

        <List
          horizontal
          data={["maxUsage", "place", "weight", "value"]}
          keyExtractor={item => item}
          style={{ justifyContent: "space-between" }}
          separator={<Spacer x={layout.globalPadding} />}
          renderItem={({ item }) => (
            <Col style={{ flex: 1 }}>
              <Txt>{item}</Txt>
              <TxtInput
                value={consumableForm[item as keyof typeof consumableForm]?.toString()}
                keyboardType="decimal-pad"
                onChangeText={e => handleSetForm(item as keyof typeof consumableForm, e)}
              />
            </Col>
          )}
        />

        <Spacer y={15} />

        <Col style={{ flex: 1 }}>
          <Txt>DESCRIPTION</Txt>
          <TxtInput
            value={consumableForm.description}
            onChangeText={e => handleSetForm("description", e)}
            multiline
          />
        </Col>

        <Spacer y={15} />

        <List
          horizontal
          data={consumableTypes}
          keyExtractor={item => item}
          style={{ justifyContent: "space-between" }}
          separator={<Spacer x={layout.globalPadding} />}
          renderItem={({ item }) => (
            <SelectorButton
              onPress={() => toggleTag(item)}
              isSelected={item in tags}
              label={item}
            />
          )}
        />

        <Spacer y={15} />

        <Row style={{ alignItems: "center" }}>
          <Txt>MODIFIERS</Txt>
          <Spacer x={20} />
          <PlusIcon size={30} onPress={addModifier} />
        </Row>
        <Spacer y={5} />
        <List
          data={Object.values(modifiers)}
          keyExtractor={item => item.id}
          separator={<Spacer y={10} />}
          renderItem={({ item }) => (
            <Row>
              <Col>
                <Txt>CALC</Txt>
                <SelectorButton
                  onPress={() => toggleModifierOperation()}
                  label={item.operation}
                  isSelected={false}
                />
              </Col>
              <Spacer x={layout.globalPadding} />
              <Col>
                <Txt>TYPE ATTR</Txt>
                <SelectorButton label="Health" isSelected={false} disabled />
              </Col>
              <Spacer x={layout.globalPadding} />
              <Col style={{ flex: 1 }}>
                <Txt>ATTR</Txt>
                <TxtInput value="rads" editable={false} />
              </Col>
              <Spacer x={layout.globalPadding} />
              <Col style={{ flex: 1 }}>
                <Txt>VALEUR</Txt>
                <TxtInput value={item.value} onChangeText={e => handleModifier("value", e)} />
              </Col>
              <DeleteInput onPress={() => deleteModifier()} isSelected />
            </Row>
          )}
        />

        <Spacer y={80} />
      </ScrollSection>

      <Spacer x={layout.globalPadding} />

      <View style={{ width: 160 }}>
        <ScrollSection style={{ flex: 1 }} title="Attributs">
          {currDisplay === "knowledges" ? (
            <List
              data={knowledgesList}
              keyExtractor={item => item.id}
              separator={<Spacer y={10} />}
              renderItem={({ item }) => (
                <Pressable onPress={() => handleSetKnowledge(item.id)}>
                  <Txt>{item.label}</Txt>
                </Pressable>
              )}
            />
          ) : null}
          {currDisplay === "effects" ? (
            <List
              data={Object.values(additionalElements.newEffects) ?? effectsArray}
              keyExtractor={item => item.id}
              separator={<Spacer y={10} />}
              renderItem={({ item }) => (
                <Pressable onPress={() => handleSetForm("effectId", item.id)}>
                  <Txt>{item.label}</Txt>
                </Pressable>
              )}
            />
          ) : null}
          {currDisplay === "skills" ? (
            <List
              data={skillsArray}
              keyExtractor={item => item.id}
              separator={<Spacer y={10} />}
              renderItem={({ item }) => (
                <Pressable onPress={() => handleSetForm("skillId", item.id)}>
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
