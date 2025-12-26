import { SkillId } from "lib/character/abilities/skills/skills.types"
import { SpecialId } from "lib/character/abilities/special/special.types"
import { TraitId } from "lib/character/abilities/traits/traits.types"
import { WeaponTagId } from "lib/objects/data/weapons/weapons.types"

export type HumanTemplate = {
  templateId: string
  label: string
  mandatorySkills: SkillId[]
  tagSkills: Partial<Record<SkillId, number>>
  special: Record<SpecialId, { min: number; max: number }>
  traits?: Partial<Record<TraitId, number>>
  weaponTags?: WeaponTagId[]
}

const humanTemplates: Record<string, HumanTemplate> = {
  craftman: {
    templateId: "craftman",
    label: "Artisan",
    mandatorySkills: ["manipulation"],
    tagSkills: { barter: 0.7, speech: 0.5, perceptionSkill: 0.5, physical: 0.4 },
    special: {
      strength: { min: 3, max: 7 },
      perception: { min: 4, max: 8 },
      endurance: { min: 4, max: 7 },
      charisma: { min: 4, max: 8 },
      intelligence: { min: 6, max: 9 },
      agility: { min: 3, max: 6 },
      luck: { min: 3, max: 6 }
    }
  },
  merchant: {
    templateId: "merchant",
    label: "Marchand",
    mandatorySkills: ["barter"],
    tagSkills: { speech: 0.8, manipulation: 0.6, perceptionSkill: 0.5, reflexion: 0.25 },
    special: {
      strength: { min: 2, max: 5 },
      perception: { min: 4, max: 7 },
      endurance: { min: 3, max: 6 },
      charisma: { min: 6, max: 10 },
      intelligence: { min: 5, max: 8 },
      agility: { min: 3, max: 6 },
      luck: { min: 4, max: 8 }
    }
  },
  businessman: {
    templateId: "businessman",
    label: "Businessman",
    mandatorySkills: ["speech", "barter"],
    tagSkills: { reflexion: 0.7, perceptionSkill: 0.5 },
    special: {
      strength: { min: 2, max: 5 },
      perception: { min: 4, max: 7 },
      endurance: { min: 3, max: 6 },
      charisma: { min: 6, max: 10 },
      intelligence: { min: 6, max: 9 },
      agility: { min: 3, max: 6 },
      luck: { min: 4, max: 7 }
    }
  },
  boxer: {
    templateId: "boxer",
    label: "Boxeur",
    mandatorySkills: ["unarmed", "physical"],
    tagSkills: { perceptionSkill: 0.6 },
    special: {
      strength: { min: 7, max: 10 },
      perception: { min: 3, max: 6 },
      endurance: { min: 6, max: 9 },
      charisma: { min: 2, max: 5 },
      intelligence: { min: 2, max: 5 },
      agility: { min: 4, max: 7 },
      luck: { min: 2, max: 5 }
    },
    traits: { heavy: 0.25, bruiser: 0.25, carnage: 0.1 }
  },
  bruiser: {
    templateId: "bruiser",
    label: "Bruiser",
    mandatorySkills: ["melee", "physical"],
    tagSkills: { unarmed: 0.7 },
    special: {
      strength: { min: 7, max: 10 },
      perception: { min: 3, max: 6 },
      endurance: { min: 6, max: 9 },
      charisma: { min: 2, max: 5 },
      intelligence: { min: 2, max: 5 },
      agility: { min: 4, max: 7 },
      luck: { min: 2, max: 5 }
    },
    traits: { heavy: 0.25, bruiser: 0.25, carnage: 0.1 }
  },
  gunner: {
    templateId: "gunner",
    label: "Tireur",
    mandatorySkills: ["smallGuns"],
    tagSkills: { perceptionSkill: 0.7, bigGuns: 0.1, stealth: 0.5 },
    special: {
      strength: { min: 4, max: 7 },
      perception: { min: 6, max: 9 },
      endurance: { min: 4, max: 7 },
      charisma: { min: 3, max: 6 },
      intelligence: { min: 4, max: 7 },
      agility: { min: 5, max: 8 },
      luck: { min: 3, max: 6 }
    },
    traits: { carnage: 0.05, finesse: 0.1 }
  },
  heavyGunner: {
    templateId: "heavyGunner",
    label: "Tireur Lourd",
    mandatorySkills: ["bigGuns", "physical"],
    tagSkills: { perceptionSkill: 0.5, throw: 0.5 },
    special: {
      strength: { min: 4, max: 7 },
      perception: { min: 6, max: 9 },
      endurance: { min: 4, max: 7 },
      charisma: { min: 3, max: 6 },
      intelligence: { min: 4, max: 7 },
      agility: { min: 5, max: 8 },
      luck: { min: 3, max: 6 }
    },
    traits: { carnage: 0.05, finesse: 0.1 }
  },
  sniper: {
    templateId: "sniper",
    label: "Sniper",
    mandatorySkills: ["smallGuns"],
    tagSkills: { stealth: 0.8, perceptionSkill: 0.9 },
    special: {
      strength: { min: 3, max: 6 },
      perception: { min: 7, max: 10 },
      endurance: { min: 3, max: 6 },
      charisma: { min: 2, max: 5 },
      intelligence: { min: 5, max: 8 },
      agility: { min: 6, max: 9 },
      luck: { min: 4, max: 7 }
    },
    traits: { finesse: 0.3, carnage: 0.1, smallFrame: 0.1 },
    weaponTags: ["sniper"]
  },
  soldier: {
    templateId: "soldier",
    label: "Soldat",
    mandatorySkills: [],
    tagSkills: {
      smallGuns: 0.9,
      physical: 0.7,
      unarmed: 0.6,
      bigGuns: 0.2,
      throw: 0.2,
      trap: 0.2,
      stealth: 0.2
    },
    special: {
      strength: { min: 5, max: 8 },
      perception: { min: 5, max: 8 },
      endurance: { min: 5, max: 8 },
      charisma: { min: 3, max: 6 },
      intelligence: { min: 4, max: 7 },
      agility: { min: 5, max: 8 },
      luck: { min: 3, max: 6 }
    },
    traits: { finesse: 0.1, carnage: 0.1 }
  },
  sapper: {
    templateId: "sapper",
    label: "Sapeur",
    mandatorySkills: ["trap", "throw"],
    tagSkills: { smallGuns: 0.7, physical: 0.5, bigGuns: 0.2, stealth: 0.2 },
    special: {
      strength: { min: 5, max: 8 },
      perception: { min: 5, max: 8 },
      endurance: { min: 5, max: 8 },
      charisma: { min: 3, max: 6 },
      intelligence: { min: 4, max: 7 },
      agility: { min: 5, max: 8 },
      luck: { min: 3, max: 6 }
    },
    traits: { finesse: 0.1, carnage: 0.1 }
  },
  smuggler: {
    templateId: "smuggler",
    label: "Contrebandier",
    mandatorySkills: ["barter", "stealth"],
    tagSkills: { trap: 0.6, manipulation: 0.6, throw: 0.5 },
    special: {
      strength: { min: 3, max: 6 },
      perception: { min: 4, max: 7 },
      endurance: { min: 3, max: 6 },
      charisma: { min: 4, max: 7 },
      intelligence: { min: 5, max: 8 },
      agility: { min: 5, max: 8 },
      luck: { min: 5, max: 9 }
    },
    traits: { finesse: 0.1, smallFrame: 0.1 }
  },
  medic: {
    templateId: "medic",
    label: "Médecin",
    mandatorySkills: ["aid"],
    tagSkills: {
      perceptionSkill: 0.8,
      reflexion: 0.6,
      speech: 0.5,
      manipulation: 0.5,
      survival: 0.3
    },
    special: {
      strength: { min: 3, max: 6 },
      perception: { min: 4, max: 7 },
      endurance: { min: 4, max: 7 },
      charisma: { min: 4, max: 7 },
      intelligence: { min: 7, max: 10 },
      agility: { min: 3, max: 6 },
      luck: { min: 3, max: 6 }
    },
    traits: { finesse: 0.1, smallFrame: 0.1 }
  },
  techie: {
    templateId: "techie",
    label: "Technicien",
    mandatorySkills: ["manipulation"],
    tagSkills: { perceptionSkill: 0.5, reflexion: 0.5, trap: 0.5 },
    special: {
      strength: { min: 2, max: 5 },
      perception: { min: 5, max: 8 },
      endurance: { min: 3, max: 6 },
      charisma: { min: 3, max: 6 },
      intelligence: { min: 7, max: 10 },
      agility: { min: 3, max: 6 },
      luck: { min: 3, max: 6 }
    },
    weaponTags: ["arme à énergie"]
  },
  scientist: {
    templateId: "scientist",
    label: "Scientifique",
    mandatorySkills: ["reflexion"],
    tagSkills: { perceptionSkill: 0.8 },
    special: {
      strength: { min: 2, max: 5 },
      perception: { min: 5, max: 8 },
      endurance: { min: 3, max: 6 },
      charisma: { min: 3, max: 6 },
      intelligence: { min: 7, max: 10 },
      agility: { min: 3, max: 6 },
      luck: { min: 3, max: 6 }
    },
    weaponTags: ["arme à énergie"]
  },
  commander: {
    templateId: "commander",
    label: "Commandant",
    mandatorySkills: ["speech"],
    tagSkills: {
      perceptionSkill: 0.5,
      reflexion: 0.5,
      smallGuns: 0.5
    },
    special: {
      strength: { min: 4, max: 7 },
      perception: { min: 5, max: 8 },
      endurance: { min: 4, max: 7 },
      charisma: { min: 6, max: 10 },
      intelligence: { min: 6, max: 9 },
      agility: { min: 4, max: 7 },
      luck: { min: 4, max: 7 }
    }
  },
  priest: {
    templateId: "priest",
    label: "Prêtre",
    mandatorySkills: ["speech"],
    tagSkills: { perceptionSkill: 0.5, reflexion: 0.5, aid: 0.6 },
    special: {
      strength: { min: 2, max: 5 },
      perception: { min: 4, max: 7 },
      endurance: { min: 3, max: 6 },
      charisma: { min: 6, max: 10 },
      intelligence: { min: 5, max: 8 },
      agility: { min: 2, max: 5 },
      luck: { min: 4, max: 8 }
    }
  },
  monk: {
    templateId: "monk",
    label: "Moine",
    mandatorySkills: [],
    tagSkills: {
      melee: 0.5,
      unarmed: 0.5,
      physical: 0.5,
      perceptionSkill: 0.4,
      stealth: 0.3,
      reflexion: 0.3
    },
    special: {
      strength: { min: 3, max: 7 },
      perception: { min: 6, max: 10 },
      endurance: { min: 4, max: 8 },
      charisma: { min: 3, max: 7 },
      intelligence: { min: 3, max: 7 },
      agility: { min: 8, max: 11 },
      luck: { min: 3, max: 7 }
    },
    traits: { carnage: 0.1, smallFrame: 0.25, finesse: 0.25 }
  },
  thief: {
    templateId: "thief",
    label: "Voleur",
    mandatorySkills: ["steal"],
    tagSkills: { stealth: 0.9, trap: 0.4, manipulation: 0.4, speech: 0.4 },
    special: {
      strength: { min: 3, max: 6 },
      perception: { min: 5, max: 8 },
      endurance: { min: 3, max: 6 },
      charisma: { min: 3, max: 6 },
      intelligence: { min: 4, max: 7 },
      agility: { min: 6, max: 9 },
      luck: { min: 5, max: 9 }
    }
  },
  hitman: {
    templateId: "hitman",
    label: "Tueur",
    mandatorySkills: [],
    tagSkills: {
      smallGuns: 0.9,
      stealth: 0.8,
      melee: 0.7,
      perceptionSkill: 0.7,
      throw: 0.3,
      trap: 0.2
    },
    special: {
      strength: { min: 4, max: 7 },
      perception: { min: 6, max: 9 },
      endurance: { min: 4, max: 7 },
      charisma: { min: 2, max: 5 },
      intelligence: { min: 5, max: 8 },
      agility: { min: 6, max: 9 },
      luck: { min: 4, max: 7 }
    }
  },
  hunter: {
    templateId: "hunter",
    label: "Chasseur",
    mandatorySkills: [],
    tagSkills: { survival: 0.9, stealth: 0.9, smallGuns: 0.8, perceptionSkill: 0.6, trap: 0.6 },
    special: {
      strength: { min: 4, max: 7 },
      perception: { min: 6, max: 9 },
      endurance: { min: 4, max: 7 },
      charisma: { min: 3, max: 6 },
      intelligence: { min: 4, max: 7 },
      agility: { min: 5, max: 8 },
      luck: { min: 3, max: 6 }
    }
  },
  scavenger: {
    templateId: "scavenger",
    label: "Récupérateur",
    mandatorySkills: [],
    tagSkills: {
      survival: 0.8,
      perceptionSkill: 0.8,
      barter: 0.8,
      stealth: 0.6,
      manipulation: 0.5,
      smallGuns: 0.4
    },
    special: {
      strength: { min: 3, max: 6 },
      perception: { min: 4, max: 7 },
      endurance: { min: 4, max: 7 },
      charisma: { min: 2, max: 5 },
      intelligence: { min: 4, max: 7 },
      agility: { min: 4, max: 7 },
      luck: { min: 4, max: 8 }
    }
  },
  tribal: {
    templateId: "tribal",
    label: "Tribal",
    mandatorySkills: [],
    tagSkills: {
      survival: 0.9,
      physical: 0.7,
      melee: 0.6,
      aid: 0.5,
      smallGuns: 0.25
    },
    special: {
      strength: { min: 4, max: 7 },
      perception: { min: 4, max: 7 },
      endurance: { min: 5, max: 8 },
      charisma: { min: 3, max: 6 },
      intelligence: { min: 3, max: 6 },
      agility: { min: 4, max: 7 },
      luck: { min: 3, max: 6 }
    },
    weaponTags: ["arme de mélée"]
  },
  civilian: {
    templateId: "civilian",
    label: "Civil",
    mandatorySkills: [],
    tagSkills: {
      speech: 0.5,
      barter: 0.5,
      survival: 0.4,
      perceptionSkill: 0.4,
      aid: 0.3
    },
    special: {
      strength: { min: 2, max: 5 },
      perception: { min: 3, max: 6 },
      endurance: { min: 3, max: 6 },
      charisma: { min: 4, max: 7 },
      intelligence: { min: 4, max: 7 },
      agility: { min: 3, max: 6 },
      luck: { min: 3, max: 6 }
    },
    weaponTags: ["arme légère"]
  }
}

export default humanTemplates
