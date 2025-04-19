import Squad from "lib/character/Squad"
import { DbCharMeta } from "lib/character/meta/meta"
import { DbStatus } from "lib/character/status/status.types"
import { computed, makeObservable, observable } from "mobx"

import { isKeyOf } from "utils/ts-utils"

import enemyTemplates from "./const/enemy-templates"
import { NonHumanEnemyTemplate } from "./enemy.types"

export default class NonHuman {
  charId: string
  fullname: string
  status: DbStatus
  date: Date
  squadId: Squad["squadId"]
  meta: DbCharMeta

  constructor(
    payload: { status: DbStatus; meta: DbCharMeta },
    game: { date: Date; squadId: string }
  ) {
    const { id, lastname, firstname } = payload.meta
    this.charId = id
    this.fullname = lastname ? `${firstname} ${lastname}` : firstname
    this.status = payload.status
    this.date = game.date
    this.squadId = game.squadId
    this.meta = payload.meta

    makeObservable(this, {
      charId: observable,
      fullname: observable,
      status: observable,
      date: observable,
      squadId: observable,
      meta: observable,
      //
      data: computed
    })
  }

  get data(): NonHumanEnemyTemplate {
    if (this.meta.speciesId === "human") throw new Error("Human enemy is not a non-human enemy")
    if (!isKeyOf(this.meta.speciesId, enemyTemplates))
      throw new Error(`${this.meta.speciesId} not in templates`)
    const templateGroup = enemyTemplates[this.meta.speciesId]
    if (!isKeyOf(this.meta.templateId, templateGroup))
      throw new Error(`${this.meta.templateId} not in templates`)
    const template = templateGroup[this.meta.templateId]
    return template
  }
}
