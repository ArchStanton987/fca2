import dbKeys from "db/db-keys"
import { DbStatus } from "lib/character/status/status.types"
import { getRtdbSub } from "lib/common/utils/rtdb-utils"

import { groupUpdateValue, updateValue } from "api/api-rtdb"

const getContainerPath = (charId: string) => dbKeys.char(charId).status.index
const getFieldPath = (charId: string, id: keyof DbStatus) =>
  getContainerPath(charId).concat("/", id)

const fbStatusRepository = {
  get: <T extends keyof DbStatus>(charId: string, field: T) => {
    const path = getFieldPath(charId, field)
    return getRtdbSub<keyof DbStatus[T]>(path)
  },
  getAll: (charId: string) => {
    const path = getContainerPath(charId)
    return getRtdbSub<DbStatus>(path)
  },
  updateElement: <T extends keyof DbStatus>(charId: string, field: T, data: DbStatus[T]) => {
    const path = getFieldPath(charId, field)
    return updateValue(path, data)
  },
  groupUpdate: (charId: string, updates: Partial<DbStatus>) => {
    const payload = Object.entries(updates).map(([key, value]) => ({
      url: getFieldPath(charId, key as keyof DbStatus),
      data: value
    }))
    return groupUpdateValue(payload)
  },
  updateAll: (charId: string, data: DbStatus) => {
    const path = getContainerPath(charId)
    return updateValue(path, data)
  }
}

export default fbStatusRepository
