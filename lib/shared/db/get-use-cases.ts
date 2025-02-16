import getAdditional from "lib/objects/get-additional"
import { DbType } from "lib/shared/db/db.types"

import { AdditionalParams } from "./api-rtdb"

export default function getUseCases(dbType: DbType = "rtdb") {
  return {
    additional: {
      getAdditionalData: (params: AdditionalParams) => getAdditional(dbType)(params)
    }
  }
}
