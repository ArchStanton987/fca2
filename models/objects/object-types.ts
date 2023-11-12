import { ClothingId } from "./clothing/clothing-types"
import { MiscObjectId } from "./misc/misc-object-types"
import { WeaponId } from "./weapon/weapon-types"

export type EquipableObjectId = ClothingId | WeaponId | MiscObjectId
