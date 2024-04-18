import FbEffectsRepository from "lib/FbEffectsRepository"

export type RepositoryName = "effects" | "inventory" | "status" | "health"

export const getRepository = {
  rtdb: {
    effects: FbEffectsRepository
  }
}
