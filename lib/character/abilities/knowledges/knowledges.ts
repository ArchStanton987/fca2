import { Knowledge, KnowledgeId } from "./knowledge-types"

const knowledgesMap: Record<KnowledgeId, Knowledge> = {
  // WEAPON TYPES
  kBladedWeapons: {
    id: "kBladedWeapons",
    label: "Armes tranchantes",
    short: "ArmTr",
    category: "weaponType"
  },
  kBluntWeapons: {
    id: "kBluntWeapons",
    label: "Armes contond.",
    short: "ArmCont",
    category: "weaponType"
  },
  kPiercWeapons: {
    id: "kPiercWeapons",
    label: "Armes perfor.",
    short: "ArmPerfo",
    category: "weaponType"
  },
  kPistol: { id: "kPistol", short: "Pisto", label: "Pistolet", category: "weaponType" },
  kRevolver: { id: "kRevolver", short: "Rev", label: "Revolver", category: "weaponType" },
  kSmg: { id: "kSmg", short: "PM", label: "Pistolet Mitrailleur", category: "weaponType" },
  kRifle: { id: "kRifle", short: "Fus", label: "Fusil", category: "weaponType" },
  kSniper: { id: "kSniper", short: "Snip", label: "Sniper", category: "weaponType" },
  kShotgun: { id: "kShotgun", short: "FusC", label: "Fusil à pompe", category: "weaponType" },
  kAssaultRifle: {
    id: "kAssaultRifle",
    short: "FusAss",
    label: "Fusil d'assaut",
    category: "weaponType"
  },
  kMg: { id: "kMg", short: "MitLou", label: "Mitrailleuse lourde", category: "weaponType" },
  kEnergyWeapons: {
    id: "kEnergyWeapons",
    short: "ArmEner",
    label: "Armes à énerg.",
    category: "weaponType"
  },
  kExplosives: { id: "kExplosives", short: "Explo", label: "Explosifs", category: "weaponType" },

  // MELEE
  kBareHands: { id: "kBareHands", label: "Mains nues", short: "MNues", category: "meleeCombat" },
  kJiuJutsu: { id: "kJiuJutsu", short: "JiuJ", label: "Jiu-Jutsu", category: "meleeCombat" },
  kDodge: { id: "kDodge", short: "Esqu", label: "Esquive", category: "meleeCombat" },
  kParry: { id: "kParry", short: "Par", label: "Parade", category: "meleeCombat" },

  // ATHLETICS
  kStunt: { id: "kStunt", short: "Acrob", label: "Acrobatie", category: "athletics" },
  kRunning: { id: "kRunning", short: "Cour", label: "Course", category: "athletics" },
  kStrength: { id: "kStrength", short: "For", label: "Force", category: "athletics" },
  kSwimming: { id: "kSwimming", short: "Nat°", label: "Natation", category: "athletics" },
  kClimbing: { id: "kClimbing", short: "Escal", label: "Escalade", category: "athletics" },

  // SENSORIAL
  kSmell: { id: "kSmell", short: "Odor", label: "Odorat", category: "sensorial" },
  kHear: { id: "kHear", short: "Ouie", label: "Ouie", category: "sensorial" },
  kSee: { id: "kSee", short: "Vue", label: "Vue", category: "sensorial" },

  // SOCIAL
  kBarter: { id: "kBarter", short: "Troc", label: "Troc", category: "social" },
  kIntimidate: { id: "kIntimidate", short: "Inti°", label: "Intimidation", category: "social" },
  kDisguise: { id: "kDisguise", short: "DeguisT", label: "Deguisement", category: "social" },

  // MEDICAL
  kFirstAid: { id: "kFirstAid", short: "Seco", label: "Secourisme", category: "medical" },
  kMedicine: { id: "kMedicine", short: "Medic", label: "Médecine", category: "medical" },
  kSurgery: { id: "kSurgery", short: "Chir", label: "Chirurgie", category: "medical" },

  // MECHANICS / SCIENCE
  kElectronics: {
    id: "kElectronics",
    short: "Electro",
    label: "Electronique",
    category: "technical"
  },
  kRepair: { id: "kRepair", short: "Répa", label: "Réparation", category: "technical" },
  kMecanicLocks: {
    id: "kMecanicLocks",
    short: "SerrMec",
    label: "Serrures méc.",
    category: "technical"
  },
  kElectronicLocks: {
    id: "kElectronicLocks",
    short: "SerrElec",
    label: "Serrures élec.",
    category: "technical"
  },
  kHacking: { id: "kHacking", short: "hack", label: "Piratage info.", category: "technical" },

  // STEALTH
  kPickpocket: { id: "kPickpocket", short: "VolàT", label: "Vol à la tire", category: "stealth" },
  kShoplifting: {
    id: "kShoplifting",
    short: "VolàEt",
    label: "Vol à l'étalage",
    category: "stealth"
  },
  kSneakAttack: {
    id: "kSneakAttack",
    short: "AttFurt",
    label: "Attaque furtive",
    category: "stealth"
  },

  // OUTDOORSMAN
  kTracking: { id: "kTracking", short: "Pist", label: "Pistage", category: "outdoorsman" },

  // TODO: LEGACY: to delete (used by vault 18 characters)
  kUnarmed: {
    isDeprecated: true,
    id: "kUnarmed",
    label: "Corps à corps",
    short: "CAC",
    category: "meleeCombat"
  },
  // TODO: consider deleting, too general (differentiate between grenades, explosives, primitive devices (boomerang, javelin, etc.), etc.)
  kThrowingWeapons: {
    isDeprecated: true,
    id: "kThrowingWeapons",
    short: "ArmLan",
    label: "Armes de lancer",
    category: "weaponType"
  },
  // TODO: consider deleting, too general (differentiate between pistols, revolvers, smgs, rifles, shotguns, etc.)
  kFirearms: {
    isDeprecated: true,
    id: "kFirearms",
    short: "ArmFeu",
    label: "Armes à feu",
    category: "weaponType"
  }
}

// create a section list of knowledges, by alphabetical order, grouped by category
const knowledgesList = Object.values(knowledgesMap).sort((a, b) => a.label.localeCompare(b.label))
// knowledges categories
const knowledgesCategories = Array.from(new Set(knowledgesList.map(k => k.category)))

export const knowledgesByCategory = knowledgesCategories.map(category => ({
  title: category,
  data: knowledgesList.filter(k => k.category === category)
}))

export default knowledgesMap
