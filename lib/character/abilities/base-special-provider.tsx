/* eslint-disable import/prefer-default-export */
import { queryOptions } from "@tanstack/react-query"

import { Special } from "./special/special.types"

export const getBaseSpecialOptions = (charId: string) =>
  queryOptions({
    queryKey: ["v3", "playables", charId, "abilities", "baseSPECIAL"],
    enabled: charId !== "",
    queryFn: () => new Promise<Special>(() => {})
  })
