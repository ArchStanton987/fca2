import { ReactElement } from "react"

import HeaderCaps from "components/Header/elements/HeaderCaps"
import HeaderProgression from "components/Header/elements/HeaderProgression"
import HeaderSpecialElement from "components/Header/elements/HeaderSpecialElement"
import { SpecialId } from "models/character/special/special-types"

import HeaderDate from "./elements/HeaderDate"
import HeaderTime from "./elements/HeaderTime"

export type HeaderElementId = "date" | "time" | "progression" | SpecialId | "caps"

export const headerElements: Record<HeaderElementId, ReactElement> = {
  date: <HeaderDate key="date" />,
  time: <HeaderTime key="time" />,
  progression: <HeaderProgression key="progression" />,
  strength: <HeaderSpecialElement key="strength" specialId="strength" />,
  perception: <HeaderSpecialElement key="perception" specialId="perception" />,
  endurance: <HeaderSpecialElement key="endurance" specialId="endurance" />,
  charisma: <HeaderSpecialElement key="charisma" specialId="charisma" />,
  intelligence: <HeaderSpecialElement key="intelligence" specialId="intelligence" />,
  agility: <HeaderSpecialElement key="agility" specialId="agility" />,
  luck: <HeaderSpecialElement key="luck" specialId="luck" />,
  caps: <HeaderCaps key="caps" />
}
