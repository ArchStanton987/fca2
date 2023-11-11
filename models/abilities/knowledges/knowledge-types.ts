export type KnowledgeLevelId = "1" | "2" | "3" | "4" | "5" | "6"

export type KnowledgeLevel = {
  id: KnowledgeLevelId
  label: string
  bonus: number
  bonusLabel: string
}

export type Knowledge = {
  id: KnowledgeId
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
