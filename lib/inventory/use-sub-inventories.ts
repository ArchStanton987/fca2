import { useCallback } from "react"

import { queryOptions, useQueries, useQuery } from "@tanstack/react-query"
import Character from "lib/character/Character"
import NonHuman from "lib/npc/NonHuman"
import Inventory from "lib/objects/Inventory"
import { CreatedElements } from "lib/objects/created-elements"
import { DbInventory } from "lib/objects/data/objects.types"
import { useMultiSub } from "lib/shared/db/useSub"

const inventoriesOptions = (charId: string, charType: "characters" | "npcs") =>
  queryOptions({
    queryKey: ["v2", charType, charId, "inventory"],
    queryFn: () => new Promise<Inventory>(() => {}),
    enabled: charId !== "",
    staleTime: Infinity
  })

const useSubInventories = (
  contenders: Record<string, Character | NonHuman>,
  newElements: CreatedElements
) => {
  const dataMap = Object.values(contenders).map(char => ({
    options: inventoriesOptions(char.charId, char.meta.isNpc ? "npcs" : "characters"),
    cb: (payload: DbInventory) => new Inventory(payload, char, newElements)
  }))
  useMultiSub(dataMap.map(({ options, cb }) => ({ queryKey: options.queryKey, cb })))
  return useQueries({
    queries: dataMap.map(({ options }) => options),
    combine: useCallback(
      (results: Array<ReturnType<typeof useQuery<Inventory>>>) => ({
        isError: results.some(r => r.isError),
        isPending: results.some(r => r.isPending),
        data: Object.fromEntries(
          dataMap.map((id, i) => (results[i].data ? [id, results[i].data] : []))
        )
      }),
      [dataMap]
    )
  })
}

export default useSubInventories
