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

export default function SubAdditionalElements() {
  useSubCollection(qkToPath(getCreatedWeaponOptions().queryKey), createdWCb)
  useSubCollection(qkToPath(getCreatedClothingsOptions().queryKey), createdClothingsCb)
  useSubCollection(qkToPath(getCreatedConsumablesOptions().queryKey), createdConsCb)
  useSubCollection(qkToPath(getCreatedEffectsOptions().queryKey), createdEffCb)
  useSubCollection(qkToPath(getCreatedMiscObjectsOptions().queryKey), createdMiscCb)
  return null
}
