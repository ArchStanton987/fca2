import { View } from "react-native"

import { useLocalSearchParams } from "expo-router"

import CreateNpc from "lib/npc/ui/create-npc-form/CreateNpcComponents"

import Col from "components/Col"
import DrawerPage from "components/DrawerPage"
import Row from "components/Row"
import Section from "components/Section"
import ScrollSection from "components/Section/ScrollSection"
import Spacer from "components/Spacer"
import layout from "styles/layout"

export default function NpcCreation() {
  const { squadId } = useLocalSearchParams<{ squadId: string }>()
  return (
    <DrawerPage>
      <ScrollSection style={{ flex: 1 }} title="Création de PNJ">
        <Row>
          <Col>
            <CreateNpc.SpeciesSelector />
          </Col>
          <Spacer x={layout.globalPadding} />
          <Col style={{ flex: 1 }}>
            <CreateNpc.FirstnamteInput />
            <CreateNpc.LastnameInput />
          </Col>
          <Spacer x={layout.globalPadding} />
          <Col style={{ flex: 1 }}>
            <CreateNpc.Template />
          </Col>
          <Spacer x={layout.globalPadding} />
          <Col style={{ flex: 1 }}>
            <CreateNpc.Hostile />
            <CreateNpc.Level />
          </Col>
        </Row>

        <Spacer y={15} />

        <CreateNpc.Description />
      </ScrollSection>

      <Spacer x={layout.globalPadding} />

      <View style={{ width: 160 }}>
        <ScrollSection style={{ flex: 1 }} title="template">
          <CreateNpc.TemplateList />
        </ScrollSection>

        <Spacer y={layout.globalPadding} />

        <Section title="enregistrer">
          <View style={{ alignItems: "center" }}>
            <CreateNpc.Submit squadId={squadId} />
          </View>
        </Section>
      </View>
    </DrawerPage>
  )
}
