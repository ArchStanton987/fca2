import RtdbRepository from "lib/shared/db/RtdbRepository"
import { ContenderParams } from "lib/shared/db/api-rtdb"

import { PlayerCombatData } from "./combats.types"

export default class ContenderRtdbRepository extends RtdbRepository<
  PlayerCombatData,
  ContenderParams
> {
  getPath(params: ContenderParams) {
    return this.rtdb.getContender(params)
  }
}
