import RtdbRepository from "lib/shared/db/RtdbRepository"
import { SquadParams } from "lib/shared/db/api-rtdb"

import { DbSquad } from "./squad-types"

export default class SquadRtdbRepository extends RtdbRepository<DbSquad, SquadParams> {
  getPath(params: SquadParams) {
    return this.rtdb.getSquad(params)
  }
}
