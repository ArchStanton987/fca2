import { useState } from "react"
import { View } from "react-native"

import { DbMiscObjectData, MiscObjectId } from "lib/objects/data/misc-objects/misc-objects-types"
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
import { useGetUseCases } from "providers/UseCasesProvider"
import layout from "styles/layout"

type ReplaceNumberWithString<T> = {
  [K in keyof T]: T[K] extends number ? string : T[K]
}
type MiscObjState = ReplaceNumberWithString<DbMiscObjectData & { id: string }>

const defaultForm = {
  id: "" as MiscObjectId,
  label: "",
  description: "",
  value: "10",
  place: "1",
  weight: "0.5",
  symptoms: {}
}

export default function MiscObjectsCreation() {
  const useCases = useGetUseCases()
  const [miscForm, setMiscForm] = useState<MiscObjState>(defaultForm)

  const handleSetForm = (key: keyof typeof miscForm, value: string) => {
    setMiscForm({ ...miscForm, [key]: value })
  }

  const submit = async () => {
    const payload = {
      ...miscForm,
      value: parseFloat(miscForm.value),
      place: parseFloat(miscForm.place),
      weight: parseFloat(miscForm.weight)
    }
    try {
      await useCases.additional.addMiscObject(JSON.parse(JSON.stringify(payload)))
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
            <TxtInput value={miscForm.id} onChangeText={e => handleSetForm("id", e)} />
          </Col>
          <Spacer x={layout.globalPadding} />
          <Col style={{ flex: 1 }}>
            <Txt>LABEL</Txt>
            <TxtInput value={miscForm.label} onChangeText={e => handleSetForm("label", e)} />
          </Col>
        </Row>

        <Spacer y={15} />

        <List
          horizontal
          data={["place", "weight", "value"] as const}
          keyExtractor={item => item}
          style={{ justifyContent: "space-between" }}
          separator={<Spacer x={layout.globalPadding} />}
          renderItem={({ item }) => (
            <Col style={{ flex: 1 }}>
              <Txt>{item}</Txt>
              <TxtInput
                value={miscForm[item]}
                keyboardType="decimal-pad"
                onChangeText={e => handleSetForm(item, e)}
              />
            </Col>
          )}
        />

        <Spacer y={15} />

        <Col style={{ flex: 1 }}>
          <Txt>DESCRIPTION</Txt>
          <TxtInput
            value={miscForm.description}
            onChangeText={e => handleSetForm("description", e)}
            multiline
          />
        </Col>
      </ScrollSection>

      <Spacer x={layout.globalPadding} />

      <View style={{ width: 160 }}>
        <Spacer fullspace />

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
