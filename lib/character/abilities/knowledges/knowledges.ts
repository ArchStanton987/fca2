import { Knowledge, KnowledgeId } from "./knowledge-types"

const knowledgesMap: Record<KnowledgeId, Knowledge> = {
  kBladedWeapons: { id: "kBladedWeapons", label: "Armes tranchantes", short: "ArmTr" },
  kBluntWeapons: { id: "kBluntWeapons", label: "Armes contond.", short: "ArmCont" },
  kPiercWeapons: { id: "kPiercWeapons", label: "Armes perfor.", short: "ArmPerfo" },
  // TODO: LEGACY: to delete (used by vault 18 characters)
  kUnarmed: { id: "kUnarmed", label: "Corps à corps", short: "CAC" },
  kBareHands: { id: "kBareHands", label: "Mains nues", short: "MNues" },
  kEnergyWeapons: { id: "kEnergyWeapons", short: "ArmEner", label: "Armes à énerg." },
  kOneHandedWeapons: { id: "kOneHandedWeapons", short: "Arm1M", label: "Armes à 1 main" },
  kTwoHandedWeapons: { id: "kTwoHandedWeapons", short: "Arm2M", label: "Armes à 2 mains" },
  kFirearms: { id: "kFirearms", short: "ArmFeu", label: "Armes à feu" },
  kThrowingWeapons: { id: "kThrowingWeapons", short: "ArmLan", label: "Armes de lancer" },
  kStunt: { id: "kStunt", short: "Acrob", label: "Acrobatie" },
  kRunning: { id: "kRunning", short: "Cour", label: "Course" },
  kStrength: { id: "kStrength", short: "For", label: "Force" },
  kSmell: { id: "kSmell", short: "Odor", label: "Odorat" },
  kHear: { id: "kHear", short: "Ouie", label: "Ouie" },
  kBarter: { id: "kBarter", short: "Troc", label: "Troc" },
  kSee: { id: "kSee", short: "Vue", label: "Vue" },
  kIntimidate: { id: "kIntimidate", short: "Inti°", label: "Intimidation" },
  kDisguise: { id: "kDisguise", short: "DeguisT", label: "Deguisement" },
  kElectronics: { id: "kElectronics", short: "Electro", label: "Electronique" },
  kFirstAid: { id: "kFirstAid", short: "Seco", label: "Secourisme" },
  kMedicine: { id: "kMedicine", short: "Medic", label: "Médecine" },
  kRepair: { id: "kRepair", short: "Répa", label: "Réparation" },
  kMecanicLocks: { id: "kMecanicLocks", short: "SerrMec", label: "Serrures méc." },
  kElectronicLocks: { id: "kElectronicLocks", short: "SerrElec", label: "Serrures élec." },
  kPickpocket: { id: "kPickpocket", short: "VolàT", label: "Vol à la tire" },
  kShoplifting: { id: "kShoplifting", short: "VolàEt", label: "Vol à l'étalage" },
  kSwimming: { id: "kSwimming", short: "Nat°", label: "Natation" },
  kClimbing: { id: "kClimbing", short: "Escal", label: "Escalade" },
  kSneakAttack: { id: "kSneakAttack", short: "AttFurt", label: "Attaque furtive" },
  kJiuJutsu: { id: "kJiuJutsu", short: "JiuJ", label: "Jiu-Jutsu" },
  kTracking: { id: "kTracking", short: "Pist", label: "Pistage" }
}

export default knowledgesMap
