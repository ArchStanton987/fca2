import { ReactNode } from "react"
import { Platform } from "react-native"

import { useKeepAwake } from "expo-keep-awake"

function WithKeepAwake() {
  useKeepAwake()
  return null
}

export default function KeepAwakeProvider({ children }: { children: ReactNode }) {
  const isWeb = Platform.OS === "web"
  if (isWeb) return children
  return (
    <>
      <WithKeepAwake />
      {children}
    </>
  )
}
