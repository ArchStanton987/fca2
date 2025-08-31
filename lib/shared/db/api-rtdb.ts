import { DbChar } from "lib/character/Character"
import { DbEffect } from "lib/character/effects/effects.types"
import { DbStatus } from "lib/character/status/status.types"
import { DbAction, DbCombatEntry, PlayerCombatData, Roll } from "lib/combat/combats.types"
import { DbNpc } from "lib/npc/npc.types"
import { DbSquad } from "lib/squad/squad-types"

type CharParams = { charId: string }
type Child<T> = { childKey?: T }

export type AdditionalCategory = "clothings" | "consumables" | "effects" | "miscObjects"

export type AdditionalClothingsParams = Child<string>
export type AdditionalConsumablesParams = Child<string>
export type AdditionalEffectsParams = Child<string>
export type AdditionalMiscParams = Child<string>
//
export type CombatParams = { id?: string; childKey?: keyof DbCombatEntry }
export type ContenderParams = {
  combatId: string
  contenderType: "players" | "npcs"
  id?: string
  childKey?: keyof PlayerCombatData
}
export type RoundParams = {
  combatId: string
  id?: number
  childKey?: number
}
export type ActionParams = {
  combatId: string
  roundId: number
  id?: number
  childKey?: keyof DbAction
}
export type RollParams = {
  combatId: string
  roundId: number
  id?: number
  childKey?: keyof Roll
}
export type NpcParams = { id?: string; childKey?: keyof DbNpc }
export type CharacterParams = { id?: string; childKey?: keyof DbChar }
export type StatusParams = CharParams & { childKey?: keyof DbStatus }
export type EffectsParams = CharParams & { dbKey?: string; childKey?: keyof DbEffect }
//
export type SquadParams = { id?: string; childKey?: keyof DbSquad }

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
  getCombat: ({ id, childKey }: CombatParams) =>
    childKey ? `v3/combat/${id}/${childKey}` : `v3/combat/${id ?? ""}`,

  getContender: ({ combatId, contenderType, id, childKey }: ContenderParams) =>
    id
      ? `v3/combat/${combatId}/${contenderType}/${id}/${childKey ?? ""}`
      : `v3/combat/${combatId}/${contenderType}/`,
  getRound: ({ combatId, id, childKey }: RoundParams) =>
    id ? `v3/combat/${combatId}/rounds/${id}/${childKey ?? ""}` : `v3/combat/${combatId}/rounds/`,

  getAction: ({ combatId, roundId, id, childKey }: ActionParams) =>
    id
      ? `v3/combat/${combatId}/rounds/${roundId}/${id}/${childKey ?? ""}`
      : `v3/combat/${combatId}/rounds/${roundId}/`,

  getRoll: ({ combatId, roundId, id, childKey }: RollParams) =>
    id
      ? `v3/combat/${combatId}/rounds/${roundId}/${id}/roll/${childKey ?? ""}`
      : `v3/combat/${combatId}/rounds/${roundId}/`,

  getEnemy: ({ id, childKey }: NpcParams) =>
    childKey ? `v3/npcs/${id}/${childKey}` : `v3/npcs/${id ?? ""}`,

  getCharacter: ({ id, childKey }: CharacterParams) =>
    id ? `v3/playables/${id}/${childKey ?? ""}` : `v3/playables/`,

  getStatus: ({ charId, childKey }: StatusParams) =>
    `v3/playables/${charId}/status/${childKey ?? ""}`,

  getEffects: ({ charId, dbKey, childKey }: EffectsParams) =>
    dbKey
      ? `v3/playables/${charId}/effects/${dbKey}/${childKey ?? ""}`
      : `v3/playables/${charId}/effects/`,

  getSquad: ({ id, childKey }: SquadParams) =>
    childKey ? `v3/squads/${id}/${childKey}` : `v3/squads/${id ?? ""}`
}

export default rtdb
