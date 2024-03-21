import HeaderElement from "components/Header/HeaderElement"
import Txt from "components/Txt"
import { useSquad } from "contexts/SquadContext"
import { getHHMM } from "utils/date"

export default function HeaderTime() {
  const { date } = useSquad()

  const displayDate = getHHMM(date)

  return (
    <HeaderElement style={{ flexGrow: 2 }}>
      <Txt>{displayDate}</Txt>
    </HeaderElement>
  )
}
