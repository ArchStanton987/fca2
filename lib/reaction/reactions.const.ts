import { DODGE_AP_COST, PARRY_AP_COST } from "lib/combat/const/combat-const"

export const reactionsRecord = {
  none: { id: "none", label: "Aucune", apCost: 0 },
  parry: { id: "parry", label: "Parade", apCost: PARRY_AP_COST },
  dodge: { id: "dodge", label: "Esquive", apCost: DODGE_AP_COST }
} as const

export const reactions = Object.values(reactionsRecord)
