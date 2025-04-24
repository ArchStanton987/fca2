import { DbChar } from "lib/character/Character"
import { DbStatus } from "lib/character/status/status.types"
import { Action, DbCombatEntry } from "lib/combat/combats.types"
import { DbEnemy } from "lib/enemy/enemy.types"
import { DbSquad } from "lib/squad/squad-types"

type CharType = "characters" | "enemies"
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
export type EnemiesParams = { id?: string; childKey?: keyof DbEnemy }
export type CharacterParams = { id?: string; childKey?: keyof DbChar }
export type StatusParams = CharParams & { childKey?: keyof DbStatus }
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

  getEnemy: ({ id, childKey }: EnemiesParams) =>
    childKey ? `v2/enemies/${id}/${childKey}` : `v2/enemies/${id ?? ""}`,

  getCharacter: ({ id, childKey }: CharacterParams) =>
    childKey ? `v2/characters/${id}/${childKey}` : `v2/characters/${id ?? ""}`,

  getStatus: ({ charId, charType, childKey }: StatusParams) =>
    `v2/${charType}/${charId}/status/${childKey ?? ""}`,

  getSquad: ({ id, childKey }: SquadParams) =>
    childKey ? `v2/squads/${id}/${childKey}` : `v2/squads/${id ?? ""}`
}

export default rtdb
