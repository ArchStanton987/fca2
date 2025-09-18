// lib/firebaseSub.ts
import { useEffect, useMemo } from "react"

import { useQueryClient } from "@tanstack/react-query"
import database from "config/firebase-env"
import { onValue, ref } from "firebase/database"

export function subscribeToPath<Db>(path: string, onData: (data: Db) => void): () => void {
  const dbRef = ref(database, path)

  const unsubscribe = onValue(dbRef, snapshot => {
    if (snapshot.exists()) {
      onData(snapshot.val())
    }
  })

  return () => unsubscribe() // for React cleanup
}

// export function subEvent<Db>(
//   event: typeof onValue | typeof onChildAdded,
//   path: string,
//   onData: (data: Db) => void
// ): () => void {
//   const dbRef = ref(database, path)

//   const unsubscribe = event(dbRef, snapshot => {
//     console.log("ON CHILD ADDED, EXISTS ?", snapshot.exists())
//     if (snapshot.exists()) {
//       console.log("ON CHILD ADDED, VALUE ?", snapshot.val())
//       onData(snapshot.val())
//     }
//   })

//   return () => unsubscribe() // for React cleanup
// }

// export function useSubEvent<Db, T = Db>(path: string, cb?: (snapshot: Db) => T) {
//   const [stored, setStored] = useState<T | Db | undefined>()

//   useEffect(() => {
//     const unsubscribe = subEvent<Db>(onChildAdded, path, data => {
//       const newData = cb ? cb(data) : data
//       setStored(newData)
//     })
//     return () => unsubscribe()
//   }, [path, cb])

//   return stored
// }

type UseSubParams<Db, T = Db> = {
  path: string
  cb?: (snapshot: Db) => T
}

export function useSub<Db, T = Db>(path: string, cb?: (snapshot: Db) => T) {
  const queryClient = useQueryClient()

  useEffect(() => {
    const unsubscribe = subscribeToPath<Db>(path, data => {
      const newData = cb?.(data) ?? data
      const queryKey = path.split("/")
      queryClient.setQueryData(queryKey, newData)
    })
    return () => unsubscribe()
  }, [queryClient, path, cb])
}

export function useMultiSub<Db, T = Db>(paramsArray: UseSubParams<Db, T>[]) {
  const queryClient = useQueryClient()

  const memoParams = useMemo(() => paramsArray, [paramsArray])
  const pathsStr = useMemo(() => JSON.stringify(memoParams.map(p => p.path)), [memoParams])

  useEffect(() => {
    const paths: string[] = JSON.parse(pathsStr)
    const unsubscribers = paths.map((path, i) =>
      subscribeToPath<Db>(path, data => {
        const newData = memoParams[i]?.cb?.(data) ?? data
        const queryKey = path.split("/")
        queryClient.setQueryData(queryKey, newData)
      })
    )

    return () => {
      unsubscribers.forEach(unsub => unsub())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryClient, pathsStr])
}
