import { DbAbilities } from "db/db-types"

import dbKeys from "../../db/db-keys"
import useDbSubscribe from "./useDbSubscribe"

export default function useGetAbilities(charId: string) {
  const dbPath = dbKeys.char(charId).abilities

  const handler = (snap: DbAbilities) => {
    const perks = snap?.perks ?? []
    const traits = snap?.traits ?? []
    return { ...snap, perks, traits } as Required<DbAbilities>
  }
  return useDbSubscribe<DbAbilities, Required<DbAbilities>>(dbPath, handler)
}
