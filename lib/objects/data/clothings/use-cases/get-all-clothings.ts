import { queryOptions } from "@tanstack/react-query"
import { useSubCollection } from "lib/shared/db/useSub"

import ClothingsMappers from "../clothings.mappers"
import { ClothingData, DbClothingData } from "../clothings.types"

export const getCreatedClothingsOptions = () =>
  queryOptions({
    queryKey: ["v3", "additional", "clothings"],
    queryFn: () => new Promise<Record<string, ClothingData>>(() => {})
  })

const cb = (payload: DbClothingData) => ClothingsMappers.toDomain(payload)

export const useSubCreatedClothings = () => {
  useSubCollection(getCreatedClothingsOptions().queryKey.join("/"), cb)
}
