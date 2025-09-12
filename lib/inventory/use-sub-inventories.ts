import { queryOptions, useQueries, useQuery } from "@tanstack/react-query"
import Character from "lib/character/Character"
import NonHuman from "lib/npc/NonHuman"
import Inventory from "lib/objects/Inventory"
import { CreatedElements } from "lib/objects/created-elements"
import { DbInventory } from "lib/objects/data/objects.types"
import { useMultiSub } from "lib/shared/db/useSub"

const options = (charId: string, charType: "characters" | "npcs") =>
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
  const contendersArr = Object.values(contenders)
  const dataMap = contendersArr.map(char => ({
    options: options(char.charId, char.meta.isNpc ? "npcs" : "characters"),
    cb: (payload: DbInventory) => new Inventory(payload, char, newElements)
  }))
  useMultiSub(dataMap.map(d => ({ queryKey: d.options.queryKey, cb: d.cb })))
  const queries = contendersArr.map(c => options(c.charId, c.meta.isNpc ? "npcs" : "characters"))
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
