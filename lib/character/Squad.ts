import { DbSquad } from "lib/squad/squad-types"

export default class Squad {
  datetime: Date
  label: string
  members: Record<string, string>
  npcs: Record<string, string>
  combats?: Record<string, string>

  constructor(payload: DbSquad) {
    this.datetime = new Date(payload.datetime)
    this.label = payload.label
    this.members = Object.fromEntries(Object.keys(payload.members ?? {}).map(i => [i, i]))
    this.npcs = Object.fromEntries(Object.keys(payload.npc ?? {}).map(i => [i, i]))
    this.combats = Object.fromEntries(Object.keys(payload.combats ?? {}).map(c => [c, c]))
  }
}
