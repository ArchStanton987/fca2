import { useCurrCharId } from "lib/character/character-store"
import { NoCombatWeaponIndicator } from "lib/combat/ui/WeaponIndicator"
import ApVisualizer from "lib/combat/ui/action-points/ApVisualizer"

import DrawerPage from "components/DrawerPage"
import Row from "components/Row"
import Section from "components/Section"
import Spacer from "components/Spacer"
import HealthFigure from "components/draws/HealthFigure/HealthFigure"
import layout from "styles/layout"

export default function CombatRecapPage() {
  const charId = useCurrCharId()
  return (
    <DrawerPage style={{ flexDirection: "column" }}>
      <ApVisualizer charId={charId} />
      <Spacer y={layout.globalPadding} />
      <Row style={{ flex: 1 }}>
        <NoCombatWeaponIndicator charId={charId} withActions />
        <Spacer x={layout.globalPadding} />
        <Section
          title="santé"
          style={{ width: 160 }}
          contentContainerStyle={{ justifyContent: "center", flex: 1 }}
        >
          <HealthFigure charId={charId} />
        </Section>
      </Row>
    </DrawerPage>
  )
}
