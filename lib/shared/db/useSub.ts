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

const fakeSub = () => () => {}

export function useSubCollection<I, T = I>(path: string, cb?: (dbCollectible: I) => T) {
  const queryClient = useQueryClient()
  const queryExists = queryClient.getQueryState(path.split("/")) !== undefined

  useEffect(() => {
    const queryKey = path.split("/")

    const unsubOnChildAdded = !queryExists
      ? subEvent<I>("onChildAdded", path, ({ key, value }) => {
          queryClient.setQueryData(queryKey, (prev: Record<string, T>) => ({
            ...prev,
            [key]: cb ? cb(value) : value
          }))
        })
      : fakeSub()

    const unsubOnChildChanged = !queryExists
      ? subEvent<I>("onChildChanged", path, ({ key, value }) => {
          queryClient.setQueryData(queryKey, (prev: Record<string, T>) => ({
            ...prev,
            [key]: cb ? cb(value) : value
          }))
        })
      : fakeSub()

    const unsubOnChildRemoved = !queryExists
      ? subEvent<I>("onChildRemoved", path, ({ key }) => {
          queryClient.setQueryData(queryKey, (prev: Record<string, T>) => {
            const { [key]: removed, ...remainingData } = prev
            return remainingData
          })
        })
      : fakeSub()

    return () => {
      unsubOnChildAdded()
      unsubOnChildChanged()
      unsubOnChildRemoved()
    }
  }, [queryClient, path, cb, queryExists])
}

type UseSubParams<Db, T = Db> = {
  path: string
  cb?: (snapshot: Db) => T
}

export function useSubMultiCollections<I, T = I>(paramsArray: UseSubParams<I, T>[]) {
  const queryClient = useQueryClient()

  const memoParams = useMemo(() => paramsArray, [paramsArray])
  const pathsStr = useMemo(() => {
    const validPaths = memoParams
      .map(p => p.path)
      .filter(path => queryClient.getQueryState(path.split("/")) === undefined)
    return JSON.stringify(validPaths)
  }, [memoParams, queryClient])

  useEffect(() => {
    const paths: string[] = JSON.parse(pathsStr)
    const childAddedUnsubscribers = paths.map((path, i) =>
      subEvent<I>("onChildAdded", path, ({ key, value }) => {
        const queryKey = path.split("/")
        const { cb } = memoParams[i]
        queryClient.setQueryData(queryKey, (prev: Record<string, T>) => ({
          ...prev,
          [key]: cb ? cb(value) : value
        }))
      })
    )
    const childChangedUnsubscribers = paths.map((path, i) =>
      subEvent<I>("onChildChanged", path, ({ key, value }) => {
        const queryKey = path.split("/")
        const { cb } = memoParams[i]
        queryClient.setQueryData(queryKey, (prev: Record<string, T>) => ({
          ...prev,
          [key]: cb ? cb(value) : value
        }))
      })
    )
    const childRemovedUnsubscribers = paths.map(path =>
      subEvent<I>("onChildChanged", path, ({ key }) => {
        const queryKey = path.split("/")
        queryClient.setQueryData(queryKey, (prev: Record<string, T>) => {
          const { [key]: removed, ...remainingData } = prev
          return remainingData
        })
      })
    )

    return () => {
      childAddedUnsubscribers.forEach(unsub => unsub())
      childChangedUnsubscribers.forEach(unsub => unsub())
      childRemovedUnsubscribers.forEach(unsub => unsub())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryClient, pathsStr])
}

export function useSub<Db, T = Db>(path: string, cb?: (snapshot: Db) => T) {
  const queryClient = useQueryClient()
  const queryExists = queryClient.getQueryState(path.split("/")) !== undefined

  useEffect(() => {
    const unsubscribe = !queryExists
      ? subscribeToPath<Db>(path, data => {
          const newData = cb?.(data) ?? data
          const queryKey = path.split("/")
          queryClient.setQueryData(queryKey, newData)
        })
      : fakeSub()
    return () => unsubscribe()
  }, [queryClient, path, cb, queryExists])
}

export function useMultiSub<Db, T = Db>(paramsArray: UseSubParams<Db, T>[]) {
  const queryClient = useQueryClient()

  const memoParams = useMemo(() => paramsArray, [paramsArray])
  const pathsStr = useMemo(() => {
    const validPaths = memoParams
      .map(p => p.path)
      .filter(path => queryClient.getQueryState(path.split("/")) === undefined)
    return JSON.stringify(validPaths)
  }, [memoParams, queryClient])

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
