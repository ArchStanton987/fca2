import { ScrollView, View } from "react-native"

import { useLocalSearchParams } from "expo-router"

import CreateCombatComponents from "lib/combat/ui/create-combat-form/CreateCombatComponents"

import Col from "components/Col"
import DrawerPage from "components/DrawerPage"
import Row from "components/Row"
import Section from "components/Section"
import ScrollSection from "components/Section/ScrollSection"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import layout from "styles/layout"

export default function CombatCreation() {
  const { squadId } = useLocalSearchParams<{ squadId: string }>()
  return (
    <DrawerPage>
      <ScrollSection style={{ flex: 1 }} title="combat">
        <Row>
          <CreateCombatComponents.IsStartingNowInput />
        </Row>

        <Spacer y={layout.globalPadding} />

        <Row>
          <Col style={{ flex: 1 }}>
            <CreateCombatComponents.Title />
          </Col>
          <Spacer x={layout.globalPadding} />
          <Col style={{ flex: 1 }}>
            <CreateCombatComponents.Location />
          </Col>
        </Row>

        <Spacer y={layout.globalPadding} />

        <CreateCombatComponents.Description />

        <Spacer y={layout.globalPadding} />

        <Txt>JOUEURS</Txt>
        <Spacer y={5} />
        <ScrollView horizontal>
          <CreateCombatComponents.PlayersList squadId={squadId} />
        </ScrollView>

        <Spacer y={layout.globalPadding} />

        <Txt>PNJs</Txt>
        <Spacer y={5} />
        <CreateCombatComponents.NpcContendersList />
        <Spacer y={80} />
      </ScrollSection>

      <Spacer x={layout.globalPadding} />

      <View style={{ width: 160 }}>
        <ScrollSection style={{ flex: 1 }} title="PNJs">
          <CreateCombatComponents.NpcList squadId={squadId} />
        </ScrollSection>

        <Spacer y={layout.globalPadding} />

        <Section title="enregistrer">
          <View style={{ alignItems: "center" }}>
            <CreateCombatComponents.Submit squadId={squadId} />
          </View>
        </Section>
      </View>
    </DrawerPage>
  )
}
