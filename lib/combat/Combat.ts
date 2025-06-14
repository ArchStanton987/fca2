import { Action, DbCombatEntry, PlayerCombatData } from "./combats.types"

export const defaultAction = {
  actionType: "",
  actionSubtype: "",
  actorId: "",
  apCost: 0,
  healthChangeEntries: {},
  itemId: "",
  itemDbKey: "",
  targetId: ""
}

export default class Combat {
  id: string
  squadId: string
  date: Date
  location?: string
  title: string
  description: string
  currActorId: string
  players: Record<string, PlayerCombatData>
  npcs: Record<string, PlayerCombatData>
  rounds: Record<number, Record<number, Action>>

  constructor(payload: DbCombatEntry & { id: string }) {
    this.id = payload.id
    this.squadId = payload.squadId
    this.date = new Date(payload.date)
    this.location = payload.location
    this.title = payload.title
    this.description = payload.description || ""
    this.currActorId = payload.currActorId
    this.players = payload.players
    this.npcs = payload.npcs
    this.rounds = Object.fromEntries(
      Object.entries(payload.rounds ?? {}).map(([rId, round]) => {
        const roundId = Number(rId)
        const actions = Object.fromEntries(
          Object.entries(round ?? {}).map(([aId, action]) => {
            const actionId = Number(aId)
            return [actionId, action as Action]
          })
        )
        return [roundId, actions]
      })
    )
  }
}
