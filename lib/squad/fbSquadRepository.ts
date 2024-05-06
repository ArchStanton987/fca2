import dbKeys from "db/db-keys"
import { getRtdbSub } from "lib/common/utils/rtdb-utils"
import { DbSquad } from "lib/squad/squad-types"

import { updateValue } from "api/api-rtdb"

const getContainerPath = () => dbKeys.squads
const getSquadPath = (squadId: string) => dbKeys.squad(squadId).index
const getElementPath = (squadId: string, id: keyof DbSquad) => getSquadPath(squadId).concat("/", id)

type DbSquads = Record<string, DbSquad>

const fbSquadsRepository = {
  get: (squadId: string) => {
    const path = getSquadPath(squadId)
    return getRtdbSub<DbSquad>(path)
  },
  getAll: () => {
    const path = getContainerPath()
    return getRtdbSub<DbSquads>(path)
  },
  updateElement: <K extends keyof DbSquad>(squadId: string, id: K, data: DbSquad[K]) => {
    const path = getElementPath(squadId, id)
    return updateValue(path, data)
  }
}

export default fbSquadsRepository
