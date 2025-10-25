import { StyleSheet } from "react-native"

import { useCombatStatus } from "lib/character/combat-status/combat-status-provider"

import Txt from "components/Txt"
import colors from "styles/colors"

type TextProps = {
  children: React.ReactNode
  charId: string
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

export default function CombatOrderText({ charId, children }: TextProps) {
  const cs = useCombatStatus(charId, data => ({
    currAp: data.currAp,
    combatStatus: data.combatStatus
  }))
  const isWaiting = cs.data.combatStatus === "wait"
  const isDead = cs.data.combatStatus === "dead"
  const isInactive = cs.data.combatStatus === "inactive"
  const hasFinishedRound = cs.data.currAp === 0
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
