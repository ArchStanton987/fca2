import { DbSquad } from "lib/squad/squad-types"
import { computed, makeObservable, observable } from "mobx"

export default class Squad {
  dbSquad: DbSquad

  constructor(dbSquad: DbSquad) {
    this.dbSquad = dbSquad

    makeObservable(this, {
      dbSquad: observable,
      //
      squad: computed,
      //
      date: computed
    })
  }

  get squad() {
    const members = Object.entries(this.dbSquad.members).map(([id, member]) => ({ id, ...member }))
    return { ...this.dbSquad, members }
  }

  get date() {
    return new Date(this.dbSquad.datetime * 1000)
  }
}
