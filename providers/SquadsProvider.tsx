import { ReactNode } from "react"

import { useSubSquads } from "lib/squad/use-cases/sub-squad"

import LoadingScreen from "screens/LoadingScreen"

export default function SquadsProvider({ children }: { children: ReactNode }) {
  const { isPending } = useSubSquads()
  if (isPending) return <LoadingScreen />
  return children
}
