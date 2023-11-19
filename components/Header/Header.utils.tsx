import { ReactElement } from "react"

import { SpecialId } from "models/character/special/special-types"

import HeaderDate from "./elements/HeaderDate"
import HeaderSpecial from "./elements/HeaderSpecial"
import HeaderTime from "./elements/HeaderTime"

export type HeaderElementId = "date" | "time" | "progression" | SpecialId | "caps"

export const headerElements: Record<HeaderElementId, ReactElement> = {
  date: <HeaderDate />,
  time: <HeaderTime />,
  strength: <HeaderSpecial specialId="strength" />,
  perception: <HeaderSpecial specialId="perception" />,
  endurance: <HeaderSpecial specialId="endurance" />,
  charisma: <HeaderSpecial specialId="charisma" />,
  intelligence: <HeaderSpecial specialId="intelligence" />,
  agility: <HeaderSpecial specialId="agility" />,
  luck: <HeaderSpecial specialId="luck" />
}
