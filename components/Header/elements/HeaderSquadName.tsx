import HeaderElement from "components/Header/HeaderElement"
import Txt from "components/Txt"
import { useSquad } from "contexts/SquadContext"

export default function HeaderSquadName() {
  const squad = useSquad()
  const { label } = squad.data

  return (
    <HeaderElement style={{ flexGrow: 4, justifyContent: "flex-end" }}>
      <Txt>{label}</Txt>
    </HeaderElement>
  )
}
