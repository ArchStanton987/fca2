import dbKeys from "db/db-keys"
import { DbStatus, UpdatableDbStatus } from "lib/character/status/status.types"
import { getRtdbSub } from "lib/common/utils/rtdb-utils"
import { CharType } from "lib/shared/db/api-rtdb"

import { groupUpdateValue, updateValue } from "api/api-rtdb"

import Playable from "../Playable"

const getContainerPath = (charType: CharType, charId: string) =>
  dbKeys.char(charType, charId).status.index
const getFieldPath = (charType: CharType, charId: string, id: keyof UpdatableDbStatus) =>
  getContainerPath(charType, charId).concat("/", id)
const getSquadExpPath = (character: Playable) =>
  dbKeys.squad(character.squadId).members.concat("/", character.charId, "/exp")

const fbStatusRepository = {
  get: <T extends keyof UpdatableDbStatus>(charType: CharType, charId: string, field: T) => {
    const path = getFieldPath(charType, charId, field)
    return getRtdbSub<keyof UpdatableDbStatus[T]>(path)
  },
  getAll: (charType: CharType, charId: string) => {
    const path = getContainerPath(charType, charId)
    return getRtdbSub<DbStatus>(path)
  },
  updateElement: <T extends keyof UpdatableDbStatus>(
    char: Playable,
    field: T,
    data: UpdatableDbStatus[T]
  ) => {
    const charType = char.isEnemy ? "enemies" : "characters"
    const path = getFieldPath(charType, char.charId, field)
    const promises = []
    // update character exp in squad object in db
    if (field === "exp") {
      const squadExpPath = getSquadExpPath(char)
      promises.push(updateValue(squadExpPath, data))
    }
    promises.push(updateValue(path, data))
    return Promise.all(promises)
  },
  groupUpdate: (char: Playable, updates: Partial<UpdatableDbStatus>) => {
    const promises = []
    const charType = char.isEnemy ? "enemies" : "characters"
    const payload = Object.entries(updates).map(([key, value]) => ({
      url: getFieldPath(charType, char.charId, key as keyof UpdatableDbStatus),
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
