import dbKeys from "db/db-keys"
import { UpdatableDbStatus } from "lib/character/status/status.types"
import { getRtdbSub } from "lib/common/utils/rtdb-utils"

import { groupUpdateValue, updateValue } from "api/api-rtdb"

const getContainerPath = (charId: string) => dbKeys.char(charId).status.index
const getFieldPath = (charId: string, id: keyof UpdatableDbStatus) =>
  getContainerPath(charId).concat("/", id)

const fbStatusRepository = {
  get: <T extends keyof UpdatableDbStatus>(charId: string, field: T) => {
    const path = getFieldPath(charId, field)
    return getRtdbSub<keyof UpdatableDbStatus[T]>(path)
  },
  getAll: (charId: string) => {
    const path = getContainerPath(charId)
    return getRtdbSub<UpdatableDbStatus>(path)
  },
  updateElement: <T extends keyof UpdatableDbStatus>(
    charId: string,
    field: T,
    data: UpdatableDbStatus[T]
  ) => {
    const path = getFieldPath(charId, field)
    return updateValue(path, data)
  },
  groupUpdate: (charId: string, updates: Partial<UpdatableDbStatus>) => {
    const payload = Object.entries(updates).map(([key, value]) => ({
      url: getFieldPath(charId, key as keyof UpdatableDbStatus),
      data: value
    }))
    return groupUpdateValue(payload)
  }
}

export default fbStatusRepository
