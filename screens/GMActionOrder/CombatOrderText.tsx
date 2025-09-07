import { StyleSheet } from "react-native"

import { CombatStatus } from "lib/character/combat-status/combat-status.types"

import Txt from "components/Txt"
import colors from "styles/colors"

type TextProps = {
  children: React.ReactNode
  combatStatus: CombatStatus["combatStatus"]
  hasFinishedRound?: boolean
}

const styles = StyleSheet.create({
  waiting: {
    color: colors.difficulty.easy
  },
  done: {
    color: colors.terColor
  },
  dead: {
    textDecorationLine: "line-through"
  }
})

export default function CombatOrderText({ children, combatStatus, hasFinishedRound }: TextProps) {
  const isWaiting = combatStatus === "wait"
  const isDead = combatStatus === "dead"
  const isInactive = combatStatus === "inactive"
  return (
    <Txt
      style={[
        isWaiting && styles.waiting,
        (hasFinishedRound || isInactive) && styles.done,
        isDead && styles.dead
      ]}
    >
      {children}
    </Txt>
  )
}
