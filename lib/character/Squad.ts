import dbKeys from "db/db-keys"
import Character from "lib/character/Character"
import { DbSquad, SquadMember } from "lib/squad/squad-types"
import { computed, makeObservable, observable } from "mobx"

import { updateValue } from "api/api-rtdb"

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

  get date(): Date {
    return new Date(this.dbSquad.datetime)
  }

  get data() {
    const { date } = this
    const { members } = this
    return { ...this.dbSquad, date, members }
  }

  async setDatetime(newDate: Date, characters: Record<string, Character>) {
    const promises = []
    Object.values(characters).forEach(character => {
      promises.push(character.onChangeDate(newDate))
    })
    const datetimeDbKey = dbKeys.squad(this.squadId).datetime
    promises.push(updateValue(datetimeDbKey, newDate))
    return Promise.all(promises)
  }
}
