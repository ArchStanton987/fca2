import { DbSquad, SquadMember } from "lib/squad/squad-types"
import { computed, makeObservable, observable } from "mobx"

export default class Squad {
  dbSquad: DbSquad
  squadId: string

  constructor(dbSquad: DbSquad, squadId: string) {
    this.dbSquad = dbSquad
    this.squadId = squadId

    makeObservable(this, {
      dbSquad: observable,
      //
      members: computed,
      membersRecord: computed,
      //
      enemies: computed,
      enemiesRecord: computed,
      //
      date: computed,
      //
      data: computed
    })
  }

  get members() {
    return Object.entries(this.dbSquad.members).map(([id, member]) => ({ id, ...member }))
  }

  get membersRecord(): Record<string, SquadMember> {
    const res: Record<string, SquadMember> = {}
    this.members.forEach(member => {
      res[member.id] = member
    })
    return res
  }

  get enemies() {
    return Object.entries(this.dbSquad.enemies).map(([id]) => ({ id }))
  }

  get enemiesRecord(): Record<string, string> {
    const res: Record<string, string> = {}
    this.enemies.forEach(enemy => {
      res[enemy.id] = enemy.id
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
