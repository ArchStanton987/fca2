import RtdbRepository from "lib/shared/db/RtdbRepository"
import { HealthParams } from "lib/shared/db/api-rtdb"

import { DbHealth } from "./Health"

export default class HealthRtdbRepository extends RtdbRepository<DbHealth, HealthParams> {
  getPath(params: HealthParams) {
    return this.rtdb.getHealth(params)
  }
}
