import fbEffectsRepository from "lib/FbEffectsRepository"

export type RepositoryName = "Effects" | "Inventory" | "Status" | "Health"

export const getRepository = {
  rtdb: {
    Effects: fbEffectsRepository
  }
}
