import RtdbRepository from "lib/shared/db/RtdbRepository"
import { AbilitiesParams } from "lib/shared/db/api-rtdb"

import { DbAbilities } from "./abilities.types"

export default class AbilitiesRtdbRepository extends RtdbRepository<DbAbilities, AbilitiesParams> {
  getPath(params: AbilitiesParams) {
    return this.rtdb.getAbilities(params)
  }
}
