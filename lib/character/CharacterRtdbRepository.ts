import RtdbRepository from "lib/shared/db/RtdbRepository"
import { CharacterParams } from "lib/shared/db/api-rtdb"

import { DbChar } from "./Character"

export default class CharacterRtdbRepository extends RtdbRepository<DbChar, CharacterParams> {
  getPath(params: CharacterParams) {
    return this.rtdb.getCharacter(params)
  }
}
