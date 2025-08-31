import { StyleSheet } from "react-native"

import { DbStatus } from "lib/character/status/status.types"

import Txt from "components/Txt"
import colors from "styles/colors"

type TextProps = {
  children: React.ReactNode
  status: DbStatus["combatStatus"]
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

export default function CombatOrderText({ children, status, hasFinishedRound }: TextProps) {
  const isWaiting = status === "wait"
  const isDead = status === "dead"
  const isInactive = status === "inactive"
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
