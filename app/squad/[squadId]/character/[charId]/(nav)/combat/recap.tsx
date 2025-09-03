import ActionIndicator from "lib/combat/ui/ActionIndicator"
import RoundIndicator from "lib/combat/ui/RoundIndicator"
import ApVisualizer from "lib/combat/ui/action-points/ApVisualizer"

import DrawerPage from "components/DrawerPage"
import Row from "components/Row"
import Section from "components/Section"
import Spacer from "components/Spacer"
import HealthFigure from "components/draws/HealthFigure/HealthFigure"
import WeaponInfo from "screens/CombatScreen/slides/WeaponInfo"
import layout from "styles/layout"

export default function CombatPage() {
  return (
    <DrawerPage style={{ flexDirection: "column" }}>
      <ApVisualizer />
      <Spacer y={layout.globalPadding} />
      <Row style={{ flex: 1 }}>
        <RoundIndicator />
        <Spacer x={layout.globalPadding} />
        <ActionIndicator />
        <Spacer x={layout.globalPadding} />
        <Section title="arme" style={{ width: 160 }}>
          <WeaponInfo />
        </Section>
        <Spacer x={layout.globalPadding} />
        <Section
          title="santé"
          style={{ width: 160 }}
          contentContainerStyle={{ justifyContent: "center", flex: 1 }}
        >
          <HealthFigure />
        </Section>
      </Row>
    </DrawerPage>
  )
}
