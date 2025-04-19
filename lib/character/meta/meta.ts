import { BackgroundId } from "../status/status.types"

export const species = {
  human: "Humain",
  robot: "Robot",
  animal: "Animal",
  mutie: "Mutant",
  ghoul: "Goule"
}

export type SpeciesId = keyof typeof species

export type DbCharMeta = {
  id: string
  speciesId: SpeciesId
  templateId: "player" | string
  background: BackgroundId
  squadId: string
  firstname: string
  lastname: string
  description?: string
}
