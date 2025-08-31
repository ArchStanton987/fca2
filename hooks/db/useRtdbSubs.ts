/* eslint-disable import/prefer-default-export */
import { useEffect, useMemo, useState } from "react"

import { Unsubscribe } from "firebase/auth"

type Subscribe = (callback: () => void) => Unsubscribe
type RTDBStore<T> = {
  subscribe: Subscribe
  getSnapshot: () => T | undefined
  id?: string
}

type UseDynamicSubscriptionReturn<T> = Record<string, T>

export default function useRtdbSubs<T>(stores: RTDBStore<T>[]): UseDynamicSubscriptionReturn<T> {
  const [data, setData] = useState<UseDynamicSubscriptionReturn<T>>({})

  const storesMemoized = useMemo(() => stores, [stores])

  useEffect(() => {
    const unsubscribeFns: Unsubscribe[] = []

    const fetchData = (store: RTDBStore<T>, index: number) => {
      const snapshot = store.getSnapshot()
      if (snapshot !== undefined) {
        setData(prevData => {
          const newData = { ...prevData }
          if (snapshot === null) {
            delete newData[store?.id ?? index]
          } else {
            newData[store?.id ?? index] = snapshot
          }
          return newData
        })
      }

      const unsubscribe = store.subscribe(() => {
        const updatedSnapshot = store.getSnapshot()
        if (updatedSnapshot !== undefined) {
          setData(prevData => {
            const newData = { ...prevData }
            if (updatedSnapshot === null) {
              delete newData[store?.id ?? index]
            } else {
              newData[store?.id ?? index] = updatedSnapshot
            }
            return newData
          })
        }
      })

      unsubscribeFns.push(unsubscribe)
    }

    storesMemoized.forEach((store, index) => {
      fetchData(store, index)
    })

    return () => {
      unsubscribeFns.forEach(unsubscribe => unsubscribe())
    }
  }, [storesMemoized])

  return data
}
