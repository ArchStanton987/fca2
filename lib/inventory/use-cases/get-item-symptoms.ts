/* eslint-disable import/prefer-default-export */
import { useQuery } from "@tanstack/react-query"
import { Symptom } from "lib/character/effects/symptoms.type"

import { Item, getItemsOptions } from "../use-sub-inv-cat"

const getItemSymptoms = (items: Record<string, Item>) =>
  Object.values(items).reduce((acc, item) => {
    if (item.category === "weapons" || item.category === "consumables") return acc
    return item.isEquipped ? [...acc, ...item.data.symptoms] : acc
  }, [] as Symptom[])

export function useItemSymptoms(charId: string) {
  return useQuery({ ...getItemsOptions(charId), select: getItemSymptoms })
}
