import { ReactElement } from "react"

import { SecAttrId } from "lib/character/abilities/sec-attr/sec-attr-types"
import { SpecialId } from "lib/character/abilities/special/special.types"

import HeaderCaps from "components/Header/elements/HeaderCaps"
import HeaderProgression from "components/Header/elements/HeaderProgression"
import HeaderSecAttr from "components/Header/elements/HeaderSecAttr"
import HeaderSpecialElement from "components/Header/elements/HeaderSpecialElement"

import HeaderDate from "./elements/HeaderDate"
import HeaderHome from "./elements/HeaderHome"
import HeaderHp from "./elements/HeaderHp"
import HeaderPlace from "./elements/HeaderPlace"
import HeaderRads from "./elements/HeaderRads"
import HeaderSquadName from "./elements/HeaderSquadName"
import HeaderTime from "./elements/HeaderTime"
import HeaderWeight from "./elements/HeaderWeight"

type HeaderSecAttrId = Extract<SecAttrId, "actionPoints" | "armorClass" | "range" | "critChance">

export type HeaderElementId =
  | "date"
  | "time"
  | "progression"
  | SpecialId
  | HeaderSecAttrId
  | "caps"
  | "squadName"
  | "home"
  | "weight"
  | "place"
  | "hp"
  | "rads"

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
  home: <HeaderHome key="home" />,
  weight: <HeaderWeight key="weight" />,
  place: <HeaderPlace key="place" />,
  hp: <HeaderHp key="hp" />,
  rads: <HeaderRads key="rads" />,
  actionPoints: <HeaderSecAttr key="actionPoints" secAttrId="actionPoints" />,
  armorClass: <HeaderSecAttr key="armorClass" secAttrId="armorClass" />,
  range: <HeaderSecAttr key="range" secAttrId="range" />,
  critChance: <HeaderSecAttr key="critChance" secAttrId="critChance" />
}
