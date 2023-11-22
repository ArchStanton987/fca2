import { ReactElement } from "react"

import HeaderCaps from "components/Header/elements/HeaderCaps"
import HeaderDateTime from "components/Header/elements/HeaderDateTime"
import HeaderProgression from "components/Header/elements/HeaderProgression"
import HeaderSpecial from "components/Header/elements/HeaderSpecial"
import HeaderSpecialElement from "components/Header/elements/HeaderSpecialElement"
import { SpecialId } from "models/character/special/special-types"

import HeaderDate from "./elements/HeaderDate"
import HeaderTime from "./elements/HeaderTime"

export type HeaderElementId =
  | "date"
  | "time"
  | "datetime"
  | "progression"
  | SpecialId
  | "special"
  | "caps"

export const headerElements: Record<HeaderElementId, ReactElement> = {
  date: <HeaderDate />,
  time: <HeaderTime />,
  datetime: <HeaderDateTime />,
  progression: <HeaderProgression />,
  strength: <HeaderSpecialElement specialId="strength" />,
  perception: <HeaderSpecialElement specialId="perception" />,
  endurance: <HeaderSpecialElement specialId="endurance" />,
  charisma: <HeaderSpecialElement specialId="charisma" />,
  intelligence: <HeaderSpecialElement specialId="intelligence" />,
  agility: <HeaderSpecialElement specialId="agility" />,
  luck: <HeaderSpecialElement specialId="luck" />,
  caps: <HeaderCaps />,
  special: <HeaderSpecial />
}
