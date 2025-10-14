import { UseCasesConfig } from "lib/get-use-case.types"
import { AmmoSet } from "lib/objects/data/ammo/ammo.types"
import repositoryMap from "lib/shared/db/get-repository"

import { Item } from "../use-sub-inv-cat"

export type BarterParams = {
  charId: string
  items: Record<Item["id"], number>
  caps: number
  ammo: Partial<AmmoSet>
}

export default function barter(config: UseCasesConfig) {
  const { db } = config
  const itemsRepo = repositoryMap[db].itemsRepository

  return ({ charId, items, caps, ammo }: BarterParams) => {
    const promises = []

    // handle items
    Object.entries(items).forEach(([id, count]) => {})

    // handle caps
    // handle ammo
  }
}
