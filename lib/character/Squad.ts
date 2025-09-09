import { DbSquad, SquadMember } from "lib/squad/squad-types"

export default class Squad {
  dbSquad: DbSquad
  squadId: string
  combats: Record<string, string>

  constructor(dbSquad: DbSquad, squadId: string) {
    this.dbSquad = dbSquad
    this.squadId = squadId
    this.combats = dbSquad.combats ?? {}
  }

  get members() {
    return Object.entries(this.dbSquad.members ?? {}).map(([id, member]) => ({ id, ...member }))
  }

  get membersRecord(): Record<string, SquadMember> {
    const res: Record<string, SquadMember> = {}
    this.members.forEach(member => {
      res[member.id] = member
    })
    return res
  }

  get npc() {
    return Object.keys(this.dbSquad.npc ?? {}).map(id => id)
  }

  get npcRecord(): Record<string, string> {
    const res: Record<string, string> = {}
    this.npc.forEach(id => {
      res[id] = id
    })
    return res
  }

  get date(): Date {
    return new Date(this.dbSquad.datetime)
  }

  get data() {
    const { date } = this
    const { members } = this
    return { ...this.dbSquad, date, members }
  }
}
