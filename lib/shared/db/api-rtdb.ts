import { DbChar } from "lib/character/Character"
import { DbEffect } from "lib/character/effects/effects.types"
import { DbStatus } from "lib/character/status/status.types"
import { Action, DbCombatEntry } from "lib/combat/combats.types"
import { DbNpc } from "lib/npc/npc.types"
import { DbSquad } from "lib/squad/squad-types"

export type CharType = "characters" | "npcs"
type CharParams = { charId: string; charType: CharType }
type Child<T> = { childKey?: T }

export type AdditionalCategory = "clothings" | "consumables" | "effects" | "miscObjects"

export type AdditionalClothingsParams = Child<string>
export type AdditionalConsumablesParams = Child<string>
export type AdditionalEffectsParams = Child<string>
export type AdditionalMiscParams = Child<string>
//
export type CombatParams = { id?: string; childKey?: keyof DbCombatEntry }
export type RoundParams = {
  combatId: string
  roundId?: number
}
export type ActionParams = {
  combatId: string
  roundId: number
  actionId?: number
  childKey?: keyof Action
}
export type NpcParams = { id?: string; childKey?: keyof DbNpc }
export type CharacterParams = { charType: CharType; id?: string; childKey?: keyof DbChar }
export type StatusParams = CharParams & { childKey?: keyof DbStatus }
export type EffectsParams = CharParams & { dbKey?: string; childKey?: keyof DbEffect }
//
export type SquadParams = { id?: string; childKey?: keyof DbSquad }

const rtdb = {
  getAdditionalClothings: ({ childKey }: AdditionalClothingsParams) =>
    `v2/additional/clothings/${childKey ?? ""}`,
  getAdditionalConsumables: ({ childKey }: AdditionalConsumablesParams) =>
    `v2/additional/consumables/${childKey ?? ""}`,
  getAdditionalEffects: ({ childKey }: AdditionalEffectsParams) =>
    `v2/additional/effects/${childKey ?? ""}`,
  getAdditionalMiscObjects: ({ childKey }: AdditionalMiscParams) =>
    `v2/additional/miscObjects/${childKey ?? ""}`,
  //
  getCombat: ({ id, childKey }: CombatParams) =>
    childKey ? `v2/combat/${id}/${childKey}` : `v2/combat/${id ?? ""}`,

  getRound: ({ combatId, roundId }: RoundParams) => `v2/combat/${combatId}/rounds/${roundId ?? ""}`,

  getAction: ({ combatId, roundId, actionId, childKey }: ActionParams) =>
    actionId
      ? `v2/combat/${combatId}/rounds/${roundId}/${actionId}/${childKey ?? ""}`
      : `v2/combat/${combatId}/rounds/${roundId}/`,

  getEnemy: ({ id, childKey }: NpcParams) =>
    childKey ? `v2/npcs/${id}/${childKey}` : `v2/npcs/${id ?? ""}`,

  getCharacter: ({ charType, id, childKey }: CharacterParams) =>
    id ? `v2/${charType}/${id}/${childKey ?? ""}` : `v2/${charType}/`,

  getStatus: ({ charId, charType, childKey }: StatusParams) =>
    `v2/${charType}/${charId}/status/${childKey ?? ""}`,

  getEffects: ({ charId, charType, dbKey, childKey }: EffectsParams) =>
    dbKey
      ? `v2/${charType}/${charId}/effects/${dbKey}/${childKey ?? ""}`
      : `v2/${charType}/${charId}/effects/`,

  getSquad: ({ id, childKey }: SquadParams) =>
    childKey ? `v2/squads/${id}/${childKey}` : `v2/squads/${id ?? ""}`
}

export default rtdb
