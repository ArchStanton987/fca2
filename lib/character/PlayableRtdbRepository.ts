import RtdbRepository from "lib/shared/db/RtdbRepository"
import { PlayableParams } from "lib/shared/db/api-rtdb"

import { DbPlayable } from "./Playable"

export default class PlayableRtdbRepository extends RtdbRepository<DbPlayable, PlayableParams> {
  getPath(params: PlayableParams) {
    return this.rtdb.getPlayable(params)
  }
}
