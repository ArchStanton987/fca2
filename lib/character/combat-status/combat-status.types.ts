import { DEFAULT_INITIATIVE } from "lib/combat/const/combat-const"

type RoundId = number
type ArmorClassBonus = number
export type CombatStatusId = "active" | "inactive" | "wait" | "dead"
type InactiveRecord = Record<number, { roundStart: number; roundEnd: number }>
type ArmorClassBonusRecord = Record<RoundId, ArmorClassBonus>

export type DbCombatStatus = {
  currAp: number
  combatId?: string
  initiative?: number
  combatStatus?: CombatStatusId
  actionBonus?: number
  inactiveRecord?: InactiveRecord
  armorClassBonusRecord?: Record<RoundId, ArmorClassBonus>
}

export class CombatStatus {
  currAp: number
  combatId: string
  initiative: number
  combatStatus: CombatStatusId | null
  actionBonus: number
  inactiveRecord: Record<number, { roundStart: number; roundEnd: number }>
  armorClassBonusRecord: ArmorClassBonusRecord

  constructor(payload: DbCombatStatus) {
    this.currAp = payload.currAp
    this.combatId = payload?.combatId ?? ""
    this.initiative = payload.initiative ?? DEFAULT_INITIATIVE
    this.combatStatus = payload.combatStatus ?? null
    this.actionBonus = payload.actionBonus ?? 0
    this.inactiveRecord = payload.inactiveRecord ?? {}
    this.armorClassBonusRecord = payload.armorClassBonusRecord ?? {}
  }
}
