import RtdbRepository from "lib/shared/db/RtdbRepository"
import { PlayableParams } from "lib/shared/db/api-rtdb"

import { DbChar } from "./Character"

export default class PlayableRtdbRepository extends RtdbRepository<DbChar, PlayableParams> {
  getPath(params: PlayableParams) {
    return this.rtdb.getPlayable(params)
  }
}
