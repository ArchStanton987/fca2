import { ReactNode, createContext, useContext } from "react"

import { queryOptions, useQuery } from "@tanstack/react-query"
import Squad from "lib/character/Squad"
import { useSub, useSubCollection } from "lib/shared/db/useSub"

import Txt from "components/Txt"
import LoadingScreen from "screens/LoadingScreen"

import { DbSquad } from "../squad-types"

export const getSquadsOptions = () =>
  queryOptions({
    queryKey: ["v3", "squads"],
    queryFn: () => new Promise<Record<string, Squad>>(() => {})
  })
export const getSquadOptions = (squadId: string) =>
  queryOptions({
    queryKey: ["v3", "squads", squadId],
    queryFn: () => new Promise<Squad>(() => {})
  })

const cb = (payload: DbSquad) => new Squad(payload)

export function useSubSquads() {
  const options = getSquadsOptions()
  const path = options.queryKey.join("/")
  useSubCollection(path, cb)
  return useQuery(options)
}

const SquadContext = createContext({} as Squad)

export function SquadProvider({ children, squadId }: { children: ReactNode; squadId: string }) {
  const options = getSquadOptions(squadId)
  const path = options.queryKey.join("/")
  useSub(path, cb)
  const squadReq = useQuery(options)

  if (squadReq.error) return <Txt>Erreur lors de la récupération de la partie</Txt>
  if (squadReq.isPending) return <LoadingScreen />

  return <SquadContext.Provider value={squadReq.data}>{children}</SquadContext.Provider>
}

export function useSquad() {
  const squad = useContext(SquadContext)
  if (!squad) throw new Error("SquadContext not found")
  return squad
}
