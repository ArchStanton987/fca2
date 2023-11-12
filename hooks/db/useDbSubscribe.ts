import { useEffect, useState } from "react"

import database from "config/firebase"
import { onValue, ref } from "firebase/database"

export default function useDbSubscribe<T, K>(dbPath: string, handler?: (dbRes: T) => K): K | null {
  const [value, setValue] = useState<K | null>(null)

  useEffect(() => {
    const dbRef = ref(database, dbPath)
    const unsub = onValue(dbRef, snapshot => {
      let res = snapshot.val()
      if (handler) {
        res = handler(res)
      }
      setValue(res)
    })
    return () => unsub()
  }, [dbPath, handler])

  return value
}
