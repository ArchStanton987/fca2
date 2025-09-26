import beasts from "lib/npc/const/beasts"
import humanTemplates from "lib/npc/const/human-templates"
import robots from "lib/npc/const/robots"

import { SpeciesId } from "../playable.const"
import { BackgroundId } from "../status/status.types"

export type PlayingCharacterSpecies = "human" | "ghoul" | "mutie" | "half-mutie" | "deathclaw"
export type CritterSpecies = "robot" | "beast"
export type Species = CritterSpecies | PlayingCharacterSpecies
export type TemplateId =
  | "player"
  | keyof typeof humanTemplates
  | keyof typeof robots
  | keyof typeof beasts

export type DbCharInfo = {
  speciesId: SpeciesId
  templateId: TemplateId
  background: BackgroundId
  squadId: string
  firstname: string
  lastname: string
  description?: string
  isNpc: boolean
  isEnemy: boolean
  isCritter: boolean
}

export default class CharInfo {
  charId: string
  speciesId: SpeciesId
  templateId: TemplateId
  background: BackgroundId
  squadId: string
  firstname: string
  lastname: string
  description?: string
  isNpc: boolean
  isEnemy: boolean
  isCritter: boolean

  constructor(payload: DbCharInfo, charId: string) {
    this.charId = charId
    this.speciesId = payload.speciesId
    this.templateId = payload.templateId
    this.background = payload.background
    this.squadId = payload.squadId
    this.firstname = payload.firstname
    this.lastname = payload.lastname
    this.description = payload.description
    this.isNpc = payload.isNpc
    this.isEnemy = payload.isEnemy
    this.isCritter = payload.isCritter
  }
}
