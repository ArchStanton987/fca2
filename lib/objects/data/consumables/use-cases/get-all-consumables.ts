import { queryOptions } from "@tanstack/react-query"
import { useSubCollection } from "lib/shared/db/useSub"

import ConsumablesMapper from "../consumables.mappers"
import { ConsumableData, DbConsumableData } from "../consumables.types"

export const getCreatedConsumablesOptions = () =>
  queryOptions({
    queryKey: ["v3", "additional", "consumables"],
    queryFn: () => new Promise<Record<string, ConsumableData>>(() => {})
  })

const cb = (payload: DbConsumableData) => ConsumablesMapper.toDomain(payload)

export const useSubCreatedConsumables = () => {
  useSubCollection(getCreatedConsumablesOptions().queryKey.join("/"), cb)
}
