export type KnowledgeLevelId = "1" | "2" | "3" | "4" | "5" | "6"
export type KnowledgeLevelValue = 1 | 2 | 3 | 4 | 5 | 6

export type KnowledgeLevel = {
  id: KnowledgeLevelValue
  label: string
  bonus: number
  bonusLabel: string
  cost: number
}

export type KnowledgeCategory =
  | "weaponType"
  | "meleeCombat"
  | "athletics"
  | "sensorial"
  | "social"
  | "medical"
  | "technical"
  | "stealth"
  | "outdoorsman"

export type Knowledge = {
  category: KnowledgeCategory
  id: KnowledgeId
  short: string
  label: string
  isDeprecated?: boolean
}

export type KnowledgeId =
  | "kBladedWeapons"
  | "kBluntWeapons"
  | "kPiercWeapons"
  | "kPistol"
  | "kRevolver"
  | "kSmg"
  | "kRifle"
  | "kSniper"
  | "kShotgun"
  | "kAssaultRifle"
  | "kMg"
  | "kEnergyWeapons"
  | "kExplosives"
  | "kBareHands"
  | "kJiuJutsu"
  | "kDodge"
  | "kParry"
  | "kStunt"
  | "kRunning"
  | "kStrength"
  | "kSwimming"
  | "kClimbing"
  | "kSmell"
  | "kHear"
  | "kSee"
  | "kBarter"
  | "kIntimidate"
  | "kDisguise"
  | "kFirstAid"
  | "kMedicine"
  | "kSurgery"
  | "kHacking"
  | "kElectronics"
  | "kRepair"
  | "kMecanicLocks"
  | "kElectronicLocks"
  | "kPickpocket"
  | "kShoplifting"
  | "kSneakAttack"
  | "kTracking"
  //
  | "kUnarmed"
  | "kThrowingWeapons"
  | "kFirearms"
