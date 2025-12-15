import { useState } from "react"
import { Platform } from "react-native"

import Toast from "react-native-toast-message"

import { getDDMMYYYY, getHHMM } from "utils/date"

import { useDatetime } from "./sub-squad"

export default function NotifyTimeChange({ squadId }: { squadId: string }) {
  const { data: datetime } = useDatetime(squadId)
  const [currDatetime, setCurrDatetime] = useState(() => datetime.toJSON())

  if (datetime.toJSON() !== currDatetime) {
    setCurrDatetime(datetime.toJSON())
    const newDate = getDDMMYYYY(datetime)
    const newHour = getHHMM(datetime)
    Toast.show({
      type: "custom",
      text1: `Le temps passe ! Nous sommes le ${newDate}, il est ${newHour}.`,
      autoHide: Platform.OS === "web"
    })
  }

  return null
}
