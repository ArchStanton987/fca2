import dbKeys from "db/db-keys"
import { DbStatus, UpdatableDbStatus } from "lib/character/status/status.types"
import { getRtdbSub } from "lib/common/utils/rtdb-utils"

import { groupUpdateValue, updateValue } from "api/api-rtdb"

import Character from "../Character"

const getContainerPath = (charId: string) => dbKeys.char(charId).status.index
const getFieldPath = (charId: string, id: keyof UpdatableDbStatus) =>
  getContainerPath(charId).concat("/", id)
const getSquadExpPath = (character: Character) =>
  dbKeys.squad(character.squadId).members.concat("/", character.charId, "/exp")

const fbStatusRepository = {
  get: <T extends keyof UpdatableDbStatus>(charId: string, field: T) => {
    const path = getFieldPath(charId, field)
    return getRtdbSub<keyof UpdatableDbStatus[T]>(path)
  },
  getAll: (charId: string) => {
    const path = getContainerPath(charId)
    return getRtdbSub<DbStatus>(path)
  },
  updateElement: <T extends keyof UpdatableDbStatus>(
    char: Character,
    field: T,
    data: UpdatableDbStatus[T]
  ) => {
    const path = getFieldPath(char.charId, field)
    const promises = []
    // update character exp in squad object in db
    if (field === "exp") {
      const squadExpPath = getSquadExpPath(char)
      promises.push(updateValue(squadExpPath, data))
    }
    promises.push(updateValue(path, data))
    return Promise.all(promises)
  },
  groupUpdate: (char: Character, updates: Partial<UpdatableDbStatus>) => {
    const promises = []
    const payload = Object.entries(updates).map(([key, value]) => ({
      url: getFieldPath(char.charId, key as keyof UpdatableDbStatus),
      data: value
    }))
    // update character exp in squad object in db
    if (updates.exp) {
      const squadExpPath = getSquadExpPath(char)
      promises.push(updateValue(squadExpPath, updates.exp))
    }
    promises.push(groupUpdateValue(payload))

    return Promise.all(promises)
  }
}

export default fbStatusRepository
