import { DbChar } from "lib/character/Character"
import { DbStatus } from "lib/character/status/status.types"
import { DbCombatEntry } from "lib/combat/combats.types"
import { DbEnemy } from "lib/enemy/enemy.types"

type CollectibleParams = { id?: string } | { id?: string; childKey?: string } | undefined
export type AdditionalCategory = "clothings" | "consumables" | "effects" | "miscObjects"

export type AdditionalParams = { childKey?: AdditionalCategory }
export type AdditionalClothingsParams = { childKey?: string }
export type AdditionalConsumablesParams = { childKey?: string }
export type AdditionalEffectsParams = { childKey?: string }
export type AdditionalMiscParams = { childKey?: string }
//
export type CombatParams = CollectibleParams & { childKey?: keyof DbCombatEntry }
export type EnemiesParams = CollectibleParams & { childKey?: keyof DbEnemy }
export type CharacterParams = CollectibleParams & { childKey?: keyof DbChar }
export type StatusParams = CollectibleParams & { childKey?: keyof DbStatus }

const rtdb = {
  getAdditionalData: ({ childKey }: AdditionalParams) => `v2/additional/${childKey ?? ""}`,
  getAdditionalClothings: ({ childKey }: AdditionalClothingsParams) =>
    `v2/additional/clothings/${childKey ?? ""}`,
  getAdditionalConsumables: ({ childKey }: AdditionalConsumablesParams) =>
    `v2/additional/consumables/${childKey ?? ""}`,
  getAdditionalEffects: ({ childKey }: AdditionalEffectsParams) =>
    `v2/additional/effects/${childKey ?? ""}`,
  getAdditionalMiscObjects: ({ childKey }: AdditionalMiscParams) =>
    `v2/additional/miscObjects/${childKey ?? ""}`,
  //
  getCombat: ({ id, childKey }: CombatParams) => `v2/combat/${id}/${childKey ?? ""}`,
  getEnemy: ({ id, childKey }: EnemiesParams) =>
    id ? `v2/enemies/${id}/${childKey ?? ""}` : `v2/enemies/${childKey ?? ""}`,
  getCharacter: ({ id, childKey }: CharacterParams) => `v2/characters/${id}/${childKey ?? ""}`,
  getStatus: ({ id, childKey }: StatusParams) => `v2/characters/${id}/status/${childKey ?? ""}`
}

export default rtdb
