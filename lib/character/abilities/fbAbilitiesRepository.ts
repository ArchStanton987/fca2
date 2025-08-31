import dbKeys from "db/db-keys"
import { DbAbilities } from "lib/character/abilities/abilities.types"
import { getRtdbSub } from "lib/common/utils/rtdb-utils"
import { CharType } from "lib/shared/db/api-rtdb"

import { groupUpdateValue, updateValue } from "api/api-rtdb"

const getContainerPath = (charType: CharType, charId: string) =>
  dbKeys.char(charType, charId).abilities.index
const getCategoryPath = (charType: CharType, charId: string, category: keyof DbAbilities) =>
  dbKeys.char(charType, charId).abilities[category]

const fbAbilitiesRepository = {
  getAbilities: (charType: CharType, charId: string) => {
    const path = getContainerPath(charType, charId)
    const sub = getRtdbSub<DbAbilities>(path)
    return sub
  },

  updateUpSkills: (charType: CharType, charId: string, newUpSkills: DbAbilities["upSkills"]) => {
    const path = getCategoryPath(charType, charId, "upSkills")
    return updateValue(path, newUpSkills)
  },

  updateKnowledges: (
    charType: CharType,
    charId: string,
    newKnowledges: DbAbilities["knowledges"]
  ) => {
    const path = getCategoryPath(charType, charId, "knowledges")
    const updates = Object.entries(newKnowledges).map(([k, v]) => ({
      url: `${path}/${k}`,
      data: v
    }))
    return groupUpdateValue(updates)
  }
}

export default fbAbilitiesRepository
