import Action from "./Action"
import { DbCombatHistory, DbCombatInfo } from "./combats.types"

export const defaultAction = {
  actionType: "",
  actionSubtype: "",
  actorId: "",
  apCost: 0,
  healthChangeEntries: {},
  itemId: "",
  itemDbKey: "",
  targetId: ""
} as const

export default class Combat {
  id: string
  date: Date
  location?: string
  title: string
  description: string
  contendersIds: string[]
  history: Record<number, Record<number, Action>>

  constructor({
    info,
    history,
    combatId
  }: {
    info: DbCombatInfo
    history: DbCombatHistory
    combatId: string
  }) {
    this.id = combatId
    this.date = new Date(info.date)
    this.location = info.location
    this.title = info.title
    this.description = info.description || ""
    this.contendersIds = Object.keys(info.contenders ?? {})

    this.history = Object.fromEntries(
      Object.entries(history ?? {}).map(([rId, round]) => {
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
  }

  get currRoundId() {
    const keys = Object.keys(this.history ?? {}).map(Number)
    return keys.length > 0 ? Math.max(...keys) : 1
  }

  get currActionId() {
    const roundId = this.currRoundId
    const roundActionsKeys = Object.keys(this.history[roundId] ?? {}).map(Number)
    const lastDoneAction = roundActionsKeys.findLastIndex(r => this.history[roundId][r].isDone)
    return lastDoneAction + 2
  }
}
