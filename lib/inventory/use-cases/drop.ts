import { UseCasesConfig } from "lib/get-use-case.types"
import repositoryMap from "lib/shared/db/get-repository"

import { Item } from "../use-sub-inv-cat"

export type DropParams = {
  charId: string
  item: Item
}

export default function drop(config: UseCasesConfig) {
  const { db } = config
  const itemsRepo = repositoryMap[db].itemsRepository
  return ({ charId, item }: DropParams) => itemsRepo.delete({ charId, dbKey: item.dbKey })
}
