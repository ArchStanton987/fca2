import { StyleSheet } from "react-native"

import { useCombatId } from "lib/character/combat-status/combat-status-provider"

import Section from "components/Section"
import Txt from "components/Txt"
import colors from "styles/colors"

import { useCombat } from "../use-cases/sub-combat"

const styles = StyleSheet.create({
  centeredSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  combatStep: {
    color: colors.secColor,
    fontSize: 42,
    lineHeight: 50
  }
})

export default function ActionIndicator({ charId }: { charId: string }) {
  const { data: combatId } = useCombatId(charId)
  const { data: actionId } = useCombat(combatId, data => data.currActionId ?? 1)
  return (
    <Section contentContainerStyle={styles.centeredSection} title="ACTION" style={{ flex: 1 }}>
      <Txt style={styles.combatStep}>{actionId}</Txt>
    </Section>
  )
}
