import { queryOptions } from "@tanstack/react-query"

import ConsumablesMapper from "../consumables.mappers"
import { ConsumableData, DbConsumableData } from "../consumables.types"

export const getCreatedConsumablesOptions = () =>
  queryOptions({
    queryKey: ["v3", "additional", "consumables"],
    queryFn: () => new Promise<Record<string, ConsumableData>>(() => {})
  })

export const createdConsCb = (payload: DbConsumableData) => ConsumablesMapper.toDomain(payload)
