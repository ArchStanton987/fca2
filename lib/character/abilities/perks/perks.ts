import { Perk, PerkId } from "./perks.types"

const perksMap: Record<PerkId, Perk> = {
  concentration: {
    id: "concentration",
    label: "Concentration",
    description: "",
    availabilityLevel: 3,
    levelCount: 1,
    symptoms: []
  },
  falconEye: {
    id: "falconEye",
    label: "Oeil de faucon",
    description: "Vous portée de vue est augmentée de 50%.",
    availabilityLevel: 3,
    levelCount: 1,
    symptoms: [{ id: "range", operation: "mult", value: 1.5 }]
  },
  physEducation: {
    id: "physEducation",
    label: "Education physique",
    description: "Votre compétence 'physique' est augmentée de 15 points.",
    availabilityLevel: 3,
    levelCount: 1,
    symptoms: [{ id: "physical", operation: "add", value: 15 }]
  },
  moreCrits: {
    id: "moreCrits",
    label: "Plus de critiques",
    description: "Votre chance d'effectuer un coup critique est augmentée de 5%.",
    availabilityLevel: 3,
    levelCount: 3,
    symptoms: [{ id: "critChance", operation: "add", value: 5 }]
  }
}

export default perksMap
