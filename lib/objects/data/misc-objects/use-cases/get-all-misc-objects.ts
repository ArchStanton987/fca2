import { queryOptions } from "@tanstack/react-query"
import { useSubCollection } from "lib/shared/db/useSub"

import { DbMiscObjectData, MiscObjectData } from "../misc-objects-types"
import MiscObjectsMappers from "../misc-objects.mappers"

export const getCreatedMiscObjectsOptions = () =>
  queryOptions({
    queryKey: ["v3", "additional", "miscObjects"],
    queryFn: () => new Promise<Record<string, MiscObjectData>>(() => {})
  })

const cb = (payload: DbMiscObjectData) => MiscObjectsMappers.toDomain(payload)

export const useSubCreatedMiscObjects = () => {
  useSubCollection(getCreatedMiscObjectsOptions().queryKey.join("/"), cb)
}
