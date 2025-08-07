import { computed, makeObservable, observable } from "mobx"

import Action from "./Action"
import { DbCombatEntry, PlayerCombatData } from "./combats.types"

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
          Object.entries(round ?? {}).map(([aId, dbAction]) => {
            const actionId = Number(aId)
            const action = new Action(dbAction)
            return [actionId, action]
          })
        )
        return [roundId, actions]
      })
    )

    makeObservable(this, {
      id: observable,
      squadId: observable,
      date: observable,
      location: observable,
      title: observable,
      description: observable,
      currActorId: observable,
      players: observable,
      npcs: observable,
      rounds: observable,
      //
      currRoundId: computed,
      currActionId: computed,
      currAction: computed
    })
  }

  get currRoundId() {
    const keys = Object.keys(this.rounds ?? {}).map(Number)
    return keys.length > 0 ? Math.max(...keys) : 1
  }

  get currActionId() {
    const roundId = this.currRoundId
    const roundActions = Object.entries(this.rounds[roundId] ?? {})
    if (roundActions.length === 0) return 1
    const action = roundActions.find(([, a]) => !a?.isDone)
    if (action) {
      const [actionId] = action
      return Number(actionId)
    }
    return roundActions.length + 1
  }

  get currAction() {
    const currAction = this?.rounds?.[this.currRoundId]?.[this.currActionId]
    return currAction ?? new Action({})
  }
}
