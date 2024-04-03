import { ReactElement } from "react"

import { SpecialId } from "lib/character/abilities/special/special.types"

import HeaderCaps from "components/Header/elements/HeaderCaps"
import HeaderProgression from "components/Header/elements/HeaderProgression"
import HeaderSpecialElement from "components/Header/elements/HeaderSpecialElement"

import HeaderDate from "./elements/HeaderDate"
import HeaderHome from "./elements/HeaderHome"
import HeaderSquadName from "./elements/HeaderSquadName"
import HeaderTime from "./elements/HeaderTime"

export type HeaderElementId =
  | "date"
  | "time"
  | "progression"
  | SpecialId
  | "caps"
  | "squadName"
  | "home"

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
  caps: <HeaderCaps key="caps" />,
  squadName: <HeaderSquadName key="squadName" />,
  home: <HeaderHome key="home" />
}
