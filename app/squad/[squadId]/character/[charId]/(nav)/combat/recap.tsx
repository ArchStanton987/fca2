import ActionIndicator from "lib/combat/ui/ActionIndicator"
import RoundIndicator from "lib/combat/ui/RoundIndicator"
import WeaponIndicator from "lib/combat/ui/WeaponIndicator"
import ApVisualizer from "lib/combat/ui/action-points/ApVisualizer"

import DrawerPage from "components/DrawerPage"
import Row from "components/Row"
import Section from "components/Section"
import Spacer from "components/Spacer"
import HealthFigure from "components/draws/HealthFigure/HealthFigure"
import { useCombatStatus } from "providers/CombatStatusProvider"
import layout from "styles/layout"

export default function CombatRecapPage() {
  const { combatId } = useCombatStatus()
  const hasCombat = combatId !== ""
  return (
    <DrawerPage style={{ flexDirection: "column" }}>
      <ApVisualizer />
      <Spacer y={layout.globalPadding} />
      <Row style={{ flex: 1 }}>
        {hasCombat ? (
          <>
            <RoundIndicator />
            <Spacer x={layout.globalPadding} />
            <ActionIndicator />
          </>
        ) : null}
        <Spacer x={layout.globalPadding} />
        <WeaponIndicator withActions={!hasCombat} />
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
