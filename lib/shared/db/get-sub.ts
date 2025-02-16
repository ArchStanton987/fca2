import database from "config/firebase-env"
import { onValue, ref } from "firebase/database"

export default function getSub<T>(path: string) {
  let data: T | undefined
  const dbRef = ref(database, path)
  const subscribe = (callback: () => void) => {
    const unsub = onValue(dbRef, snapshot => {
      data = snapshot.val()
      callback()
    })
    return () => {
      data = undefined
      unsub()
    }
  }
  return { subscribe, getSnapshot: () => data as T }
}
