/* eslint-disable import/prefer-default-export */
import { useRef, useSyncExternalStore } from "react"

import { Unsubscribe } from "firebase/auth"

type Subscribe = (callback: () => void) => Unsubscribe
type RTDBStore<T> = { subscribe: Subscribe; getSnapshot: () => T | undefined }

export default function useRtdbSub<T>(getter: RTDBStore<T>) {
  const store = useRef(getter)
  return useSyncExternalStore(store.current.subscribe, store.current.getSnapshot)
}
