import { Knowledge, KnowledgeId } from "./knowledge-types"

const knowledges: Record<KnowledgeId, Knowledge> = {
  kBladedWeapons: { id: "kBladedWeapons", label: "Armes tranchantes" },
  kBluntWeapons: { id: "kBluntWeapons", label: "Armes contond." },
  kUnarmed: { id: "kUnarmed", label: "Corps à corps" },
  kEnergyWeapons: { id: "kEnergyWeapons", label: "Armes à énerg." },
  kOneHandedWeapons: { id: "kOneHandedWeapons", label: "Armes à 1 main" },
  kTwoHandedWeapons: { id: "kTwoHandedWeapons", label: "Armes à 2 mains" },
  kFirearms: { id: "kFirearms", label: "Armes à feu" },
  kThrowingWeapons: { id: "kThrowingWeapons", label: "Armes de lancer" },
  kStunt: { id: "kStunt", label: "Acrobatie" },
  kRunning: { id: "kRunning", label: "Course" },
  kStrength: { id: "kStrength", label: "Force" },
  kSmell: { id: "kSmell", label: "Odorat" },
  kHear: { id: "kHear", label: "Ouie" },
  kBarter: { id: "kBarter", label: "Troc" },
  kSee: { id: "kSee", label: "Vue" },
  kIntimidate: { id: "kIntimidate", label: "Intimidation" },
  kDisguise: { id: "kDisguise", label: "Deguisement" },
  kElectronics: { id: "kElectronics", label: "Electronique" },
  kFirstAid: { id: "kFirstAid", label: "Secourisme" },
  kMedicine: { id: "kMedicine", label: "Médecine" },
  kRepair: { id: "kRepair", label: "Réparation" },
  kMecanicLocks: { id: "kMecanicLocks", label: "Serrures méc." },
  kElectronicLocks: { id: "kElectronicLocks", label: "Serrures élec." },
  kPickpocket: { id: "kPickpocket", label: "Vol à la tire" },
  kShoplifting: { id: "kShoplifting", label: "Vol à l'étalage" },
  kSwimming: { id: "kSwimming", label: "Natation" },
  kClimbing: { id: "kClimbing", label: "Escalade" },
  kSneakAttack: { id: "kSneakAttack", label: "Attaque furtive" },
  kJiuJutsu: { id: "kJiuJutsu", label: "Jiu-Jutsu" },
  kTracking: { id: "kTracking", label: "Pistage" }
}

export default knowledges
