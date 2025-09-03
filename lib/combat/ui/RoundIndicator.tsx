import { StyleSheet } from "react-native"

import Section from "components/Section"
import Txt from "components/Txt"
import { useCombat } from "providers/CombatProvider"
import colors from "styles/colors"

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

export default function RoundIndicator() {
  const { combat } = useCombat()
  return (
    <Section contentContainerStyle={styles.centeredSection} title="ROUND" style={{ flex: 1 }}>
      <Txt style={styles.combatStep}>{combat?.currRoundId ?? 1}</Txt>
    </Section>
  )
}
