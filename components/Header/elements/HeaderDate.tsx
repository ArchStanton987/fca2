import HeaderElement from "components/Header/HeaderElement"
import Txt from "components/Txt"
import { useSquad } from "contexts/SquadContext"
import { getDDMMYYYY } from "utils/date"

export default function HeaderDate() {
  const { date } = useSquad()

  const displayDate = getDDMMYYYY(date, "-")

  return (
    <HeaderElement style={{ flexGrow: 2 }}>
      <Txt>{displayDate}</Txt>
    </HeaderElement>
  )
}
