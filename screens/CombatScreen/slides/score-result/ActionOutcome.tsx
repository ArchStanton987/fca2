import Txt from "components/Txt"

import styles from "./ScoreResultSlide.styles"

export default function ActionOutcome({
  isCritSuccess,
  isCritFail,
  finalScore,
  isCritHit
}: {
  finalScore: number
  isCritSuccess: boolean
  isCritFail: boolean
  isCritHit: boolean
}) {
  if (isCritSuccess) {
    return <Txt style={[styles.outcome, styles.critSuccess]}>Réussite critique !</Txt>
  }
  if (isCritHit) {
    return <Txt style={[styles.outcome, styles.critSuccess]}>Coup critique !</Txt>
  }
  if (isCritFail) {
    return <Txt style={[styles.outcome, styles.critFail]}>Échec critique !</Txt>
  }
  return (
    <Txt style={[styles.outcome, finalScore > 0 ? styles.success : styles.fail]}>
      {finalScore > 0 ? "Réussite !" : "Échec"}
    </Txt>
  )
}
