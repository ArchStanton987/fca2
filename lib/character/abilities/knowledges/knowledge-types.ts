export type KnowledgeLevelId = "1" | "2" | "3" | "4" | "5" | "6"
export type KnowledgeLevelValue = 1 | 2 | 3 | 4 | 5 | 6

export type KnowledgeLevel = {
  id: KnowledgeLevelValue
  label: string
  bonus: number
  bonusLabel: string
  cost: number
}

export type Knowledge = {
  id: KnowledgeId
  short: string
  label: string
}

export type KnowledgeId =
  | "kBladedWeapons"
  | "kBluntWeapons"
  | "kUnarmed"
  | "kEnergyWeapons"
  | "kOneHandedWeapons"
  | "kTwoHandedWeapons"
  | "kFirearms"
  | "kThrowingWeapons"
  | "kStunt"
  | "kRunning"
  | "kStrength"
  | "kSmell"
  | "kHear"
  | "kBarter"
  | "kSee"
  | "kIntimidate"
  | "kDisguise"
  | "kElectronics"
  | "kFirstAid"
  | "kMedicine"
  | "kRepair"
  | "kMecanicLocks"
  | "kElectronicLocks"
  | "kPickpocket"
  | "kShoplifting"
  | "kSwimming"
  | "kClimbing"
  | "kSneakAttack"
  | "kJiuJutsu"
  | "kTracking"
