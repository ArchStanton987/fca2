// lib/firebaseSub.ts
import { useEffect, useMemo } from "react"

import { useQueryClient } from "@tanstack/react-query"
import database from "config/firebase-env"
import { onChildAdded, onChildChanged, onChildRemoved, onValue, ref } from "firebase/database"

export function subscribeToPath<Db>(path: string, onData: (data: Db) => void): () => void {
  const dbRef = ref(database, path)

  const unsubscribe = onValue(dbRef, snapshot => {
    if (snapshot.exists()) {
      onData(snapshot.val())
    }
  })

  return () => unsubscribe() // for React cleanup
}

const eventMap = { onValue, onChildAdded, onChildChanged, onChildRemoved }

export function subEvent<DbItem>(
  event: keyof typeof eventMap,
  path: string,
  onData: (db: { key: string; value: DbItem }) => void
): () => void {
  const dbRef = ref(database, path)

  const unsubscribe = eventMap[event](dbRef, snapshot => {
    if (snapshot.exists() && snapshot.key) {
      onData({ key: snapshot.key, value: snapshot.val() })
    }
  })

  return () => unsubscribe() // for React cleanup
}

export function useSubCollection<I, T = I>(path: string, cb?: (dbCollectible: I) => T) {
  const queryClient = useQueryClient()
  const dbRef = ref(database, path)

  useEffect(() => {
    const queryKey = path.split("/")

    const unsubOnChildAdded = subEvent<I>("onChildAdded", path, ({ key, value }) => {
      queryClient.setQueryData(queryKey, (prev: Record<string, T>) => ({
        ...prev,
        [key]: cb ? cb({ ...value, key }) : { ...value, key }
      }))
    })

    const unsubOnChildChanged = subEvent<I>("onChildChanged", path, ({ key, value }) => {
      queryClient.setQueryData(queryKey, (prev: Record<string, T>) => ({
        ...prev,
        [key]: cb ? cb({ ...value, key }) : { ...value, key }
      }))
    })

    const unsubOnChildRemoved = subEvent<I>("onChildRemoved", path, ({ key }) => {
      queryClient.setQueryData(queryKey, (prev: Record<string, T>) => {
        const { [key]: removed, ...remainingData } = prev
        return remainingData
      })
    })

    const unsubOnValue = onValue(dbRef, snapshot => {
      if (!snapshot.exists()) {
        queryClient.setQueryData(queryKey, {})
      }
    })

    return () => {
      unsubOnChildAdded()
      unsubOnChildChanged()
      unsubOnChildRemoved()
      unsubOnValue()
    }
  }, [queryClient, path, cb, dbRef])
}

type UseSubParams<Db, T = Db> = {
  path: string
  cb?: (snapshot: Db) => T
}

export function useSubMultiCollections<I, T = I>(paramsArray: UseSubParams<I, T>[]) {
  const queryClient = useQueryClient()

  const memoParams = useMemo(() => paramsArray, [paramsArray])
  const pathsStr = useMemo(() => {
    const validPaths = memoParams.map(p => p.path)
    return JSON.stringify(validPaths)
  }, [memoParams])

  useEffect(() => {
    const paths: string[] = JSON.parse(pathsStr)
    const childAddedUnsubscribers = paths.map((path, i) => {
      const queryKey = path.split("/")
      return subEvent<I>("onChildAdded", path, ({ key, value }) => {
        const { cb } = memoParams[i]
        const v = cb ? cb({ ...value, key }) : { ...value, key }
        queryClient.setQueryData(queryKey, (prev: Record<string, T>) => ({
          ...prev,
          [key]: v
        }))
      })
    })
    const childChangedUnsubscribers = paths.map((path, i) => {
      const queryKey = path.split("/")
      return subEvent<I>("onChildChanged", path, ({ key, value }) => {
        const { cb } = memoParams[i]
        queryClient.setQueryData(queryKey, (prev: Record<string, T>) => ({
          ...prev,
          [key]: cb ? cb({ ...value, key }) : { ...value, key }
        }))
      })
    })
    const childRemovedUnsubscribers = paths.map(path => {
      const queryKey = path.split("/")
      return subEvent<I>("onChildRemoved", path, ({ key }) => {
        queryClient.setQueryData(queryKey, (prev: Record<string, T>) => {
          const { [key]: removed, ...remainingData } = prev
          return remainingData
        })
      })
    })
    const onChangeUnsubscribers = paths.map(path => {
      const queryKey = path.split("/")
      const dbRef = ref(database, path)
      return onValue(dbRef, snapshot => {
        if (!snapshot.exists()) {
          queryClient.setQueryData(queryKey, {})
        }
      })
    })

    return () => {
      childAddedUnsubscribers.forEach(unsub => unsub())
      childChangedUnsubscribers.forEach(unsub => unsub())
      childRemovedUnsubscribers.forEach(unsub => unsub())
      onChangeUnsubscribers.forEach(unsub => unsub())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryClient, pathsStr])
}

export function useSub<Db, T = Db>(path: string, cb?: (snapshot: Db) => T) {
  const queryClient = useQueryClient()

  useEffect(() => {
    const queryKey = path.split("/")
    const unsubscribe = subscribeToPath<Db>(path, data => {
      const newData = cb?.(data) ?? data
      queryClient.setQueryData(queryKey, newData)
    })
    return () => unsubscribe()
  }, [queryClient, path, cb])
}

export function useMultiSub<Db, T = Db>(paramsArray: UseSubParams<Db, T>[]) {
  const queryClient = useQueryClient()

  const memoParams = useMemo(() => paramsArray, [paramsArray])
  const pathsStr = useMemo(() => {
    const validPaths = memoParams.map(p => p.path)
    return JSON.stringify(validPaths)
  }, [memoParams])

  useEffect(() => {
    const paths: string[] = JSON.parse(pathsStr)
    const unsubscribers = paths.map((path, i) => {
      const queryKey = path.split("/")
      return subscribeToPath<Db>(path, data => {
        const newData = memoParams[i]?.cb?.(data) ?? data
        queryClient.setQueryData(queryKey, newData)
      })
    })

    return () => {
      unsubscribers.forEach(unsub => unsub())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryClient, pathsStr])
}
