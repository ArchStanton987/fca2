import { useMemo } from "react"

import { queryOptions, useQueries, useQuery } from "@tanstack/react-query"
import Character from "lib/character/Character"
import NonHuman from "lib/npc/NonHuman"
import Inventory from "lib/objects/Inventory"
import { CreatedElements } from "lib/objects/created-elements"
import { DbInventory } from "lib/objects/data/objects.types"
import { useMultiSub } from "lib/shared/db/useSub"

const options = (charId: string) =>
  queryOptions({
    queryKey: ["v3", "playables", charId, "inventory"],
    queryFn: () => new Promise<Inventory>(() => {}),
    enabled: charId !== ""
  })

const useSubInventories = (
  contenders: Record<string, Character | NonHuman>,
  newElements: CreatedElements
) => {
  const contendersArr = useMemo(() => Object.values(contenders), [contenders])
  const dataMap = useMemo(
    () =>
      contendersArr.map(char => ({
        options: options(char.charId),
        cb: (payload: DbInventory) => new Inventory(payload, char, newElements)
      })),
    [contendersArr, newElements]
  )
  const subs = useMemo(
    () => dataMap.map(d => ({ path: d.options.queryKey.join("/"), cb: d.cb })),
    [dataMap]
  )
  useMultiSub(subs)
  const queries = contendersArr.map(c => options(c.charId))
  return useQueries({
    queries,
    combine: (
      results: Array<ReturnType<typeof useQuery<Inventory>>>
    ): { isError: boolean; isPending: boolean; data: Record<string, Inventory> } => ({
      isError: results.some(r => r.isError),
      isPending: results.some(r => r.isPending),
      data: Object.fromEntries(
        results.map((r, i) => (r.data ? [contendersArr[i].charId, r.data] : []))
      )
    })
  })
}

export default useSubInventories
