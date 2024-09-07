import { WeaponActionId, WeaponActionNameId } from "lib/objects/data/weapons/weapons.types"

export type WeaponAction = {
  id: WeaponActionNameId
  label: string
  actionId: WeaponActionId
}

export const weaponActionMap: Record<WeaponActionNameId, WeaponAction> = {
  strike: { id: "strike", label: "Frapper", actionId: "basic" as const },
  strikeAim: { id: "strikeAim", label: "Frapper (viser)", actionId: "aim" as const },
  shoot: { id: "shoot", label: "Tirer", actionId: "basic" as const },
  shootBurst: { id: "shootBurst", label: "Tirer (rafale)", actionId: "burst" as const },
  shootAim: { id: "shootAim", label: "Tirer (viser)", actionId: "aim" as const },
  load: { id: "load", label: "Recharger", actionId: "load" },
  unload: { id: "unload", label: "Décharger", actionId: "unload" }
}
