// lib/firebaseSub.ts
import { useEffect } from "react"

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

type UseSubParams<T, Db> = {
  queryKey: string[]
  path?: string
  cb?: (snapshot: Db) => T
}

export function useSub<T, Db>(params: UseSubParams<T, Db>) {
  const { queryKey, path, cb } = params
  const queryClient = useQueryClient()

  useEffect(() => {
    const unsubscribe = subscribeToPath<Db>(path ?? queryKey.join("/"), data => {
      const newData = cb?.(data) ?? data
      queryClient.setQueryData(queryKey, newData)
    })
    return () => unsubscribe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}

export function useMultiSub<T, Db>(paramsArray: UseSubParams<T, Db>[]) {
  const queryClient = useQueryClient()

  useEffect(() => {
    const unsubscribers = paramsArray.map(({ queryKey, path, cb }) =>
      subscribeToPath<Db>(path ?? queryKey.join("/"), data => {
        const newData = cb?.(data) ?? data
        queryClient.setQueryData(queryKey, newData)
      })
    )

    return () => {
      unsubscribers.forEach(unsub => unsub())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
