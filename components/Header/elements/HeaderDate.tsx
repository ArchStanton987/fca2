import { useLocalSearchParams } from "expo-router"

import { useDatetime } from "lib/squad/use-cases/sub-squad"

import HeaderElement from "components/Header/HeaderElement"
import Txt from "components/Txt"
import { getDDMMYYYY } from "utils/date"

export default function HeaderDate() {
  const { squadId } = useLocalSearchParams<{ squadId: string }>()

  const { data: date } = useDatetime(squadId)

  const displayDate = getDDMMYYYY(date, "-")

  return (
    <HeaderElement style={{ flexGrow: 2 }}>
      <Txt style={{ fontSize: 12 }}>{displayDate}</Txt>
    </HeaderElement>
  )
}
