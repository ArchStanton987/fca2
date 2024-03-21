import { getLevelAndThresholds } from "lib/character/status/status-calc"

import HeaderElement from "components/Header/HeaderElement"
import ProgressionBar from "components/ProgressionBar/ProgressionBar"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import { useCharacter } from "contexts/CharacterContext"

export default function HeaderProgression() {
  const character = useCharacter()
  const { exp } = character.status

  const { level, prev, next } = getLevelAndThresholds(exp)
  return (
    <HeaderElement>
      <Txt>NIV:{level}</Txt>
      <Spacer x={10} />
      <ProgressionBar value={exp} min={prev} max={next} />
    </HeaderElement>
  )
}
