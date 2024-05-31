import dbKeys from "db/db-keys"
import { DbAbilities } from "lib/character/abilities/abilities.types"
import { getRtdbSub } from "lib/common/utils/rtdb-utils"

import { updateValue } from "api/api-rtdb"

const getContainerPath = (charId: string) => dbKeys.char(charId).abilities.index
const getCategoryPath = (charId: string, category: keyof DbAbilities) =>
  dbKeys.char(charId).abilities[category]

const fbAbilitiesRepository = {
  getAbilities: (charId: string) => {
    const path = getContainerPath(charId)
    const sub = getRtdbSub<DbAbilities>(path)
    return sub
  },

  updateUpSkills: (charId: string, newUpSkills: DbAbilities["upSkills"]) => {
    const path = getCategoryPath(charId, "upSkills")
    return updateValue(path, newUpSkills)
  },

  updateKnowledges: (charId: string, newKnowledges: DbAbilities["knowledges"]) => {
    const path = getCategoryPath(charId, "knowledges")
    return updateValue(path, newKnowledges)
  }
}

export default fbAbilitiesRepository
