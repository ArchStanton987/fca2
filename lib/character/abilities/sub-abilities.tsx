/* eslint-disable import/prefer-default-export */
import { queryOptions, useQuery } from "@tanstack/react-query"
import { useSub } from "lib/shared/db/useSub"

import { DbAbilities } from "./abilities.types"

const getAbilitiesOptions = (charId: string) =>
  queryOptions({
    queryKey: ["v3", "playables", charId, "abilities"],
    enabled: charId !== "",
    queryFn: () => new Promise<DbAbilities>(() => {})
  })

export function useSubAbilities(charId: string) {
  const path = getAbilitiesOptions(charId).queryKey.join("/")
  useSub(path)
}
export function useAbilitiesQuery(charId: string) {
  return useQuery(getAbilitiesOptions(charId))
}
