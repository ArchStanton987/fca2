import RtdbRepository from "lib/shared/db/RtdbRepository"
import { NpcParams } from "lib/shared/db/api-rtdb"

import { DbNpc } from "./npc.types"

export default class NpcRtdbRepository extends RtdbRepository<DbNpc, NpcParams> {
  getPath(params: NpcParams) {
    return this.rtdb.getEnemy(params)
  }
}
