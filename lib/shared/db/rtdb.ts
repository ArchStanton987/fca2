import { DbChar } from "lib/character/Character"
import { DbAdditionalEffects } from "lib/character/effects/AdditionalEffectsRtdbRepository"
import { DbCombatEntry } from "lib/combat/combats.types"
import { DbNonHumanNpc } from "lib/npc/npc.types"
import { DbAdditionalClothings } from "lib/objects/data/clothings/AdditionalClothingsRtdbRepository"
import { DbAdditionalConsumables } from "lib/objects/data/consumables/AdditionalConsumablesRtdbRepository"
import { DbAdditionalMisc } from "lib/objects/data/misc-objects/AdditionalMiscRtdbRepository"
import { DbSquad } from "lib/squad/squad-types"

type DbGame = {
  id: string
  label: string
  datetime: string
  players: Record<string, string>
  npcs: Record<string, string>
}
type DbAdditionnal = {
  clothings?: DbAdditionalClothings
  consumables?: DbAdditionalConsumables
  effects?: DbAdditionalEffects
  miscObjects?: DbAdditionalMisc
}

export type Rtdb = {
  v2: RtdbV2
  v3: RtdbV3
}
export type RtdbV2 = {
  additional?: DbAdditionnal
  characters: Record<string, DbChar>
  combat?: Record<string, DbCombatEntry>
  npcs: Record<string, DbChar | DbNonHumanNpc>
  squads: Record<string, DbSquad>
}

export type RtdbV3 = {
  createdItems?: DbAdditionnal
  playables: Record<string, DbChar | DbNonHumanNpc>
  combats?: Record<string, DbCombatEntry>
  games: Record<string, DbGame>
}
