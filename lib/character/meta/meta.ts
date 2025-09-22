import beasts from "lib/npc/const/beasts"
import humanTemplates from "lib/npc/const/human-templates"
import robots from "lib/npc/const/robots"

import { BackgroundId } from "../status/status.types"

export type PlayingCharacterSpecies = "human" | "ghoul" | "mutie" | "half-mutie" | "deathclaw"
export type CritterSpecies = "robot" | "beast"
export type Species = CritterSpecies | PlayingCharacterSpecies

export const species = {
  human: "Humain",
  ghoul: "Goule",
  mutie: "Mutant",
  halfMutie: "Semi-mutant",
  deathclaw: "Griffemort",
  robot: "Robot",
  beast: "Bestiole"
}

export const withDodgeSpecies: SpeciesId[] = ["human", "ghoul", "mutie", "halfMutie", "deathclaw"]

export type SpeciesId = keyof typeof species

export type DbCharMeta = {
  speciesId: SpeciesId
  templateId: "player" | keyof typeof humanTemplates | keyof typeof robots | keyof typeof beasts
  background: BackgroundId
  squadId: string
  firstname: string
  lastname: string
  description?: string
  isNpc: boolean
  isEnemy: boolean
  isCritter: boolean
}
