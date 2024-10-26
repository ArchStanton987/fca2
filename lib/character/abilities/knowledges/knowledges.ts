import { Knowledge, KnowledgeId } from "./knowledge-types"

const knowledgesMap: Record<KnowledgeId, Knowledge> = {
  // WEAPON TYPES
  kBladedWeapons: { id: "kBladedWeapons", label: "Armes tranchantes", short: "ArmTr" },
  kBluntWeapons: { id: "kBluntWeapons", label: "Armes contond.", short: "ArmCont" },
  kPiercWeapons: { id: "kPiercWeapons", label: "Armes perfor.", short: "ArmPerfo" },
  kPistol: { id: "kPistol", short: "Pisto", label: "Pistolet" },
  kRevolver: { id: "kRevolver", short: "Rev", label: "Revolver" },
  kSmg: { id: "kSmg", short: "PM", label: "Pistolet Mitrailleur" },
  kRifle: { id: "kRifle", short: "Fus", label: "Fusil" },
  kSniper: { id: "kSniper", short: "Snip", label: "Sniper" },
  kShotgun: { id: "kShotgun", short: "FusC", label: "Fusil à pompe" },
  kAssaultRifle: { id: "kAssaultRifle", short: "FusAss", label: "Fusil d'assaut" },
  kMg: { id: "kMg", short: "MitLou", label: "Mitrailleuse lourde" },
  kEnergyWeapons: { id: "kEnergyWeapons", short: "ArmEner", label: "Armes à énerg." },
  kExplosives: { id: "kExplosives", short: "Explo", label: "Explosifs" },

  // MELEE
  kBareHands: { id: "kBareHands", label: "Mains nues", short: "MNues" },
  kJiuJutsu: { id: "kJiuJutsu", short: "JiuJ", label: "Jiu-Jutsu" },
  kDodge: { id: "kDodge", short: "Esqu", label: "Esquive" },
  kParry: { id: "kParry", short: "Par", label: "Parade" },

  // ATHLETICS
  kStunt: { id: "kStunt", short: "Acrob", label: "Acrobatie" },
  kRunning: { id: "kRunning", short: "Cour", label: "Course" },
  kStrength: { id: "kStrength", short: "For", label: "Force" },
  kSwimming: { id: "kSwimming", short: "Nat°", label: "Natation" },
  kClimbing: { id: "kClimbing", short: "Escal", label: "Escalade" },

  // SENSORIAL
  kSmell: { id: "kSmell", short: "Odor", label: "Odorat" },
  kHear: { id: "kHear", short: "Ouie", label: "Ouie" },
  kSee: { id: "kSee", short: "Vue", label: "Vue" },

  // SOCIAL
  kBarter: { id: "kBarter", short: "Troc", label: "Troc" },
  kIntimidate: { id: "kIntimidate", short: "Inti°", label: "Intimidation" },
  kDisguise: { id: "kDisguise", short: "DeguisT", label: "Deguisement" },

  // AID
  kFirstAid: { id: "kFirstAid", short: "Seco", label: "Secourisme" },
  kMedicine: { id: "kMedicine", short: "Medic", label: "Médecine" },
  kSurgery: { id: "kSurgery", short: "Chir", label: "Chirurgie" },

  // MECHANICS / SCIENCE
  kElectronics: { id: "kElectronics", short: "Electro", label: "Electronique" },
  kRepair: { id: "kRepair", short: "Répa", label: "Réparation" },
  kMecanicLocks: { id: "kMecanicLocks", short: "SerrMec", label: "Serrures méc." },
  kElectronicLocks: { id: "kElectronicLocks", short: "SerrElec", label: "Serrures élec." },
  kHacking: { id: "kHacking", short: "hack", label: "Piratage info." },

  // STEALTH
  kPickpocket: { id: "kPickpocket", short: "VolàT", label: "Vol à la tire" },
  kShoplifting: { id: "kShoplifting", short: "VolàEt", label: "Vol à l'étalage" },
  kSneakAttack: { id: "kSneakAttack", short: "AttFurt", label: "Attaque furtive" },

  // OUTDOORSMAN
  kTracking: { id: "kTracking", short: "Pist", label: "Pistage" },

  // TODO: LEGACY: to delete (used by vault 18 characters)
  kUnarmed: { id: "kUnarmed", label: "Corps à corps", short: "CAC" },
  // TODO: consider deleting, too general (differentiate between grenades, explosives, primitive devices (boomerang, javelin, etc.), etc.)
  kThrowingWeapons: { id: "kThrowingWeapons", short: "ArmLan", label: "Armes de lancer" },
  // TODO: consider deleting, too general (differentiate between pistols, revolvers, smgs, rifles, shotguns, etc.)
  kFirearms: { id: "kFirearms", short: "ArmFeu", label: "Armes à feu" }
}

export default knowledgesMap
