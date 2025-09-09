import Action from "./Action"
import { DbCombatState } from "./combats.types"

export default class CombatState {
  action: Action
  actorIdOverride: string | null

  constructor(payload: DbCombatState) {
    this.action = new Action(payload?.action ?? {})
    this.actorIdOverride = payload?.actorIdOverride ?? null
  }
}
