import dbKeys from "db/db-keys"

import useDbSubscribe from "./useDbSubscribe"

type DbMember = {
  id: string
  exp: number
  firstname: string
  lastname: string
}

type DbSquad = {
  id: string
  label: string
  members: Record<DbMember["id"], DbMember>
  datetime: number
}

export default function useGetSquad(squadId: string) {
  const dbPath = dbKeys.squad(squadId).index

  return useDbSubscribe<DbSquad, DbSquad>(dbPath)
}
