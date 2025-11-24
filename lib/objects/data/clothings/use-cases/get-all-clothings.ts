import { queryOptions } from "@tanstack/react-query"

import ClothingsMappers from "../clothings.mappers"
import { ClothingData, DbClothingData } from "../clothings.types"

export const getCreatedClothingsOptions = () =>
  queryOptions({
    queryKey: ["v3", "additional", "clothings"],
    queryFn: () => new Promise<Record<string, ClothingData>>(() => {})
  })

export const createdClothingsCb = (payload: DbClothingData) => ClothingsMappers.toDomain(payload)
