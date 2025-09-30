import { DbPlayable } from "lib/character/Playable"
import { DbCombatStatus } from "lib/character/combat-status/combat-status.types"
import { DbEffect } from "lib/character/effects/effects.types"
import { DbHealth } from "lib/character/health/Health"
import { DbStatus } from "lib/character/status/status.types"
import { DbAction, DbCombatInfo, Roll } from "lib/combat/combats.types"
import { DbInventory } from "lib/objects/data/objects.types"
import { DbSquad } from "lib/squad/squad-types"

type CharParams = { charId: string }
type Child<T> = { childKey?: T }

export type AdditionalCategory = "clothings" | "consumables" | "effects" | "miscObjects"

export type AdditionalClothingsParams = Child<string>
export type AdditionalConsumablesParams = Child<string>
export type AdditionalEffectsParams = Child<string>
export type AdditionalMiscParams = Child<string>
//
export type CombatParams = { id?: string }
export type CombatInfoParams = { id: string; childKey?: keyof DbCombatInfo }
export type CombatHistoryParams = { id: string; childKey?: number }
export type CombatStateParams = { id: string; childKey?: "action" | "actorIdOverride" }
export type RoundParams = {
  combatId: string
  id?: number
  childKey?: number
}
export type ActionParams = {
  combatId: string
  childKey?: keyof DbAction
}
export type RollParams = {
  combatId: string
  roundId: number
  id?: number
  childKey?: keyof Roll
}
export type PlayableParams = { id?: string; childKey?: keyof DbPlayable }
export type StatusParams = CharParams & { childKey?: keyof DbStatus }
export type HealthParams = CharParams & { childKey?: keyof DbHealth }
export type CombatStatusParams = CharParams & { childKey?: keyof DbCombatStatus }
export type EffectsParams = CharParams & { dbKey?: string; childKey?: keyof DbEffect }
//
export type SquadParams = { id?: string; childKey?: keyof DbSquad }

export type InventoryParams = CharParams & { childKey?: keyof DbInventory }
export type ItemsParams = CharParams & { childKey?: string }

const rtdb = {
  getAdditionalClothings: ({ childKey }: AdditionalClothingsParams) =>
    `v3/additional/clothings/${childKey ?? ""}`,
  getAdditionalConsumables: ({ childKey }: AdditionalConsumablesParams) =>
    `v3/additional/consumables/${childKey ?? ""}`,
  getAdditionalEffects: ({ childKey }: AdditionalEffectsParams) =>
    `v3/additional/effects/${childKey ?? ""}`,
  getAdditionalMiscObjects: ({ childKey }: AdditionalMiscParams) =>
    `v3/additional/miscObjects/${childKey ?? ""}`,
  //
  getCombat: ({ id }: CombatParams) => `v3/combats/${id ?? ""}`,
  getCombatInfo: ({ id, childKey }: CombatInfoParams) => `v3/combats/${id}/info/${childKey ?? ""}`,
  getCombatHistory: ({ id, childKey }: CombatHistoryParams) =>
    `v3/combats/${id}/history/${childKey ?? ""}`,
  getCombatState: ({ id, childKey }: CombatStateParams) =>
    `v3/combats/${id}/state/${childKey ?? ""}`,
  getAction: ({ combatId, childKey }: ActionParams) =>
    `v3/combats/${combatId}/state/action/${childKey ?? ""}`,

  getInventory: ({ charId, childKey }: InventoryParams) =>
    `v3/playables/${charId}/inventory/${childKey ?? ""}`,

  getItems: ({ charId, childKey }: ItemsParams) =>
    `v3/playables/${charId}/inventory/items/${childKey ?? ""}`,

  // getRound: ({ combatId, id, childKey }: RoundParams) =>
  //   id ? `v3/combats/${combatId}/rounds/${id}/${childKey ?? ""}` : `v3/combats/${combatId}/rounds/`,

  // getRoll: ({ combatId, roundId, id, childKey }: RollParams) =>
  //   id
  //     ? `v3/combats/${combatId}/rounds/${roundId}/${id}/roll/${childKey ?? ""}`
  //     : `v3/combats/${combatId}/rounds/${roundId}/`,

  getPlayable: ({ id, childKey }: PlayableParams) =>
    id ? `v3/playables/${id}/${childKey ?? ""}` : `v3/playables/`,

  getStatus: ({ charId, childKey }: StatusParams) =>
    `v3/playables/${charId}/status/${childKey ?? ""}`,
  getHealth: ({ charId, childKey }: HealthParams) =>
    `v3/playables/${charId}/health/${childKey ?? ""}`,
  getCombatStatus: ({ charId, childKey }: CombatStatusParams) =>
    `v3/playables/${charId}/combatStatus/${childKey ?? ""}`,

  getEffects: ({ charId, dbKey, childKey }: EffectsParams) =>
    dbKey
      ? `v3/playables/${charId}/effects/${dbKey}/${childKey ?? ""}`
      : `v3/playables/${charId}/effects/`,

  getSquad: ({ id, childKey }: SquadParams) =>
    childKey ? `v3/squads/${id}/${childKey}` : `v3/squads/${id ?? ""}`
}

export default rtdb
