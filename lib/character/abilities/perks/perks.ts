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
    description: "",
    availabilityLevel: 3,
    levelCount: 1,
    symptoms: [{ id: "range", operation: "mult", value: 1.5 }]
  },
  physEducation: {
    id: "concentration",
    label: "Education physique",
    description: "",
    availabilityLevel: 3,
    levelCount: 1,
    symptoms: [{ id: "physical", operation: "add", value: 15 }]
  },
  moreCrits: {
    id: "moreCrits",
    label: "Plus de critiques",
    description: "",
    availabilityLevel: 3,
    levelCount: 1,
    symptoms: [{ id: "critChance", operation: "add", value: 5 }]
  }
}

export default perksMap
