import { queryOptions } from "@tanstack/react-query"

import { DbMiscObjectData, MiscObjectData } from "../misc-objects-types"
import MiscObjectsMappers from "../misc-objects.mappers"

export const getCreatedMiscObjectsOptions = () =>
  queryOptions({
    queryKey: ["v3", "additional", "miscObjects"],
    queryFn: () => new Promise<Record<string, MiscObjectData>>(() => {})
  })

export const createdMiscCb = (payload: DbMiscObjectData) => MiscObjectsMappers.toDomain(payload)
