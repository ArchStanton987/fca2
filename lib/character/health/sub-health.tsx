/* eslint-disable import/prefer-default-export */
import { useCallback } from "react"

import { queryOptions, useQuery } from "@tanstack/react-query"
import { useSub } from "lib/shared/db/useSub"

import { useAbilitiesQuery } from "../abilities/abilities-provider"
import { useExpQuery } from "../sub-exp"
import Health, { DbHealth } from "./Health"

const getHealthOptions = (charId: string) =>
  queryOptions({
    queryKey: ["v3", "playables", charId, "health"],
    enabled: charId !== "",
    queryFn: () => new Promise<Health>(() => {})
  })

export function useSubHealth(charId: string) {
  const abilitiesReq = useAbilitiesQuery(charId)
  const baseSPECIAL = abilitiesReq.data?.baseSPECIAL
  const exp = useExpQuery(charId).data

  const cb = useCallback(
    (payload: DbHealth) => {
      if (!baseSPECIAL || typeof exp !== "number") return undefined
      return new Health(payload, baseSPECIAL, exp)
    },
    [baseSPECIAL, exp]
  )

  const options = getHealthOptions(charId)
  const path = options.queryKey.join("/")
  useSub(path, cb)
}

export function useHealthQuery(charId: string) {
  return useQuery(getHealthOptions(charId))
}
