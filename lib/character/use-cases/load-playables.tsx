import { ReactNode } from "react"

import { useQueries } from "@tanstack/react-query"

import LoadingScreen from "screens/LoadingScreen"

import { getPlayableOptions } from "./sub-playables"

function Loader({ children, playablesIds }: { children: ReactNode; playablesIds: string[] }) {
  const isPending = useQueries({
    queries: playablesIds.flatMap(m => getPlayableOptions(m)),
    combine: r => r.some(q => q.isPending)
  })
  if (isPending) return <LoadingScreen />
  return children
}

export default function LoadPlayables({
  children,
  playablesIds
}: {
  children: ReactNode
  playablesIds: string[]
}) {
  return <Loader playablesIds={playablesIds}>{children}</Loader>
}
