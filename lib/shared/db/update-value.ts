import database from "config/firebase-env"
import { ref, update } from "firebase/database"

import { RtdbReturnTypes } from "./api-rtdb.types"

export default function updateValue(url: RtdbReturnTypes, data: any) {
  const updates: Record<RtdbReturnTypes, any> = {}
  updates[url] = data
  return update(ref(database), updates)
}
