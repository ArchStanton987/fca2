import { useLocalSearchParams } from "expo-router"

import { useCombatStatus } from "lib/character/combat-status/combat-status-provider"
import ActionIndicator from "lib/combat/ui/ActionIndicator"
import RoundIndicator from "lib/combat/ui/RoundIndicator"
import { CombatWeaponIndicator } from "lib/combat/ui/WeaponIndicator"
import ApVisualizer from "lib/combat/ui/action-points/ApVisualizer"

import DrawerPage from "components/DrawerPage"
import Row from "components/Row"
import Section from "components/Section"
import Spacer from "components/Spacer"
import HealthFigure from "components/draws/HealthFigure/HealthFigure"
import layout from "styles/layout"

export default function InCombatRecapPage() {
  const { charId } = useLocalSearchParams<{ charId: string }>()
  const { data: combatId } = useCombatStatus(charId, cs => cs.combatId)
  const hasCombat = combatId !== ""
  return (
    <DrawerPage style={{ flexDirection: "column" }}>
      <ApVisualizer charId={charId} />
      <Spacer y={layout.globalPadding} />
      <Row style={{ flex: 1 }}>
        {hasCombat ? (
          <>
            <RoundIndicator charId={charId} />
            <Spacer x={layout.globalPadding} />
            <ActionIndicator charId={charId} />
          </>
        ) : null}
        <Spacer x={layout.globalPadding} />
        <CombatWeaponIndicator contenderId={charId} />
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
