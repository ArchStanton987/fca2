import { ReactNode } from "react"

import { useQueries } from "@tanstack/react-query"
import {
  createdEffCb,
  getCreatedEffectsOptions
} from "lib/character/effects/use-cases/get-all-effects"
import {
  createdClothingsCb,
  getCreatedClothingsOptions
} from "lib/objects/data/clothings/use-cases/get-all-clothings"
import {
  createdConsCb,
  getCreatedConsumablesOptions
} from "lib/objects/data/consumables/use-cases/get-all-consumables"
import {
  createdMiscCb,
  getCreatedMiscObjectsOptions
} from "lib/objects/data/misc-objects/use-cases/get-all-misc-objects"
import {
  createdWCb,
  getCreatedWeaponOptions
} from "lib/objects/data/weapons/use-cases/get-all-weapons"
import { qkToPath, useSubCollection } from "lib/shared/db/useSub"
import { getSquadsOptions, squadCb } from "lib/squad/use-cases/sub-squad"

import LoadingScreen from "screens/LoadingScreen"

function Subscriber() {
  // created elements
  useSubCollection(qkToPath(getCreatedWeaponOptions().queryKey), createdWCb)
  useSubCollection(qkToPath(getCreatedClothingsOptions().queryKey), createdClothingsCb)
  useSubCollection(qkToPath(getCreatedConsumablesOptions().queryKey), createdConsCb)
  useSubCollection(qkToPath(getCreatedEffectsOptions().queryKey), createdEffCb)
  useSubCollection(qkToPath(getCreatedMiscObjectsOptions().queryKey), createdMiscCb)

  // squads
  useSubCollection(qkToPath(getSquadsOptions().queryKey), squadCb)
  return null
}

function Loader({ children }: { children: ReactNode }) {
  const queries = [
    getSquadsOptions(),
    getCreatedWeaponOptions(),
    getCreatedClothingsOptions(),
    getCreatedConsumablesOptions(),
    getCreatedEffectsOptions(),
    getCreatedMiscObjectsOptions()
  ]
  const isPending = useQueries({
    queries,
    combine: res => res.some(q => q.isPending)
  })

  if (isPending) return <LoadingScreen />
  return children
}

export default function InitProvider({ children }: { children: ReactNode }) {
  return (
    <>
      <Subscriber />
      <Loader>{children}</Loader>
    </>
  )
}
