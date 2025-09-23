import { useQueries, useQuery } from "@tanstack/react-query"
import { Symptom } from "lib/character/effects/symptoms.type"
import { useMultiSub } from "lib/shared/db/useSub"

import { Item, getItemsOptions } from "../use-sub-inv-cat"

const getItemSymptoms = (items: Record<string, Item>) =>
  Object.values(items).reduce((acc, item) => {
    if (item.category === "weapons" || item.category === "consumables") return acc
    return item.isEquipped ? [...acc, ...item.data.symptoms] : acc
  }, [] as Symptom[])

export function useItemSymptoms(charId: string) {
  return useQuery({ ...getItemsOptions(charId), select: getItemSymptoms })
}

export function useContendersItemSymptoms(ids: string[]) {
  const queries = ids.map(id => getItemsOptions(id))
  useMultiSub(queries.map(q => ({ path: q.queryKey.join("/") })))

  return useQueries({
    queries,
    combine: req => ({
      isPending: req.some(r => r.isPending),
      isError: req.some(r => r.isError),
      data: Object.fromEntries(req.map((r, i) => [ids[i], getItemSymptoms(r.data ?? {})]))
    })
  })
}
