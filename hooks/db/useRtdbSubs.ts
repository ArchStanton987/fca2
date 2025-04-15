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
        setData(prevData => ({
          ...prevData,
          [store?.id ?? index]: snapshot
        }))
      }

      const unsubscribe = store.subscribe(() => {
        const updatedSnapshot = store.getSnapshot()
        if (updatedSnapshot !== undefined) {
          setData(prevData => ({
            ...prevData,
            [store?.id ?? index]: updatedSnapshot
          }))
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
