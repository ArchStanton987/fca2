export const species = {
  human: "Humain",
  ghoul: "Goule",
  mutie: "Mutant",
  halfMutie: "Semi-mutant",
  deathclaw: "Griffemort",
  robot: "Robot",
  beast: "Bestiole"
}

export type SpeciesId = keyof typeof species

export const withDodgeSpecies: SpeciesId[] = ["human", "ghoul", "mutie", "halfMutie", "deathclaw"]
