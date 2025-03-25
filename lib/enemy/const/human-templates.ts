import { SkillId } from "lib/character/abilities/skills/skills.types"
import { SpecialId } from "lib/character/abilities/special/special.types"
import { TraitId } from "lib/character/abilities/traits/traits.types"

const humanTemplates: Record<
  string,
  {
    tagSkills: Partial<Record<SkillId, number>>
    special: Record<SpecialId, { min: number; max: number }>
    traits?: Partial<Record<TraitId, number>>
  }
> = {
  craftman: {
    tagSkills: {
      manipulation: 0.9,
      stealth: 0.6,
      barter: 0.7,
      speech: 0.5
    },
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
    tagSkills: {
      barter: 0.95,
      speech: 0.8,
      stealth: 0.4,
      manipulation: 0.6
    },
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
    tagSkills: {
      speech: 0.9,
      barter: 0.85,
      manipulation: 0.7,
      stealth: 0.4
    },
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
  bruiser: {
    tagSkills: {
      melee: 0.9,
      unarmed: 0.8,
      physical: 0.7
    },
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
    tagSkills: {
      smallGuns: 0.9,
      bigGuns: 0.1,
      stealth: 0.5,
      perceptionSkill: 0.7
    },
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
    tagSkills: {
      smallGuns: 0.95,
      stealth: 0.8,
      perceptionSkill: 0.9
    },
    special: {
      strength: { min: 3, max: 6 },
      perception: { min: 7, max: 10 },
      endurance: { min: 3, max: 6 },
      charisma: { min: 2, max: 5 },
      intelligence: { min: 5, max: 8 },
      agility: { min: 6, max: 9 },
      luck: { min: 4, max: 7 }
    },
    traits: { finesse: 0.3, carnage: 0.1, smallFrame: 0.1 }
  },
  soldier: {
    tagSkills: {
      smallGuns: 0.9,
      unarmed: 0.6,
      physical: 0.6,
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
  smuggler: {
    tagSkills: {
      stealth: 0.9,
      barter: 0.7,
      manipulation: 0.6,
      throw: 0.5
    },
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
    tagSkills: {
      aid: 0.95,
      speech: 0.7,
      manipulation: 0.5,
      stealth: 0.4
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
    tagSkills: {
      manipulation: 0.9,
      stealth: 0.6,
      trap: 0.7,
      perceptionSkill: 0.5
    },
    special: {
      strength: { min: 2, max: 5 },
      perception: { min: 5, max: 8 },
      endurance: { min: 3, max: 6 },
      charisma: { min: 3, max: 6 },
      intelligence: { min: 7, max: 10 },
      agility: { min: 3, max: 6 },
      luck: { min: 3, max: 6 }
    }
  },
  commander: {
    tagSkills: {
      speech: 0.9,
      manipulation: 0.8,
      perceptionSkill: 0.6,
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
    tagSkills: {
      speech: 0.9,
      manipulation: 0.7,
      aid: 0.6,
      survival: 0.4
    },
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
    tagSkills: { melee: 0.5, unarmed: 0.5, physical: 0.5, stealth: 0.3 },
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
    tagSkills: {
      stealth: 0.9,
      steal: 0.8,
      throw: 0.6,
      manipulation: 0.5
    },
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
    tagSkills: {
      smallGuns: 0.9,
      stealth: 0.8,
      perceptionSkill: 0.7,
      throw: 0.6
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
  spy: {
    tagSkills: {
      stealth: 0.9,
      manipulation: 0.8,
      speech: 0.7,
      perceptionSkill: 0.6
    },
    special: {
      strength: { min: 3, max: 6 },
      perception: { min: 5, max: 8 },
      endurance: { min: 3, max: 6 },
      charisma: { min: 5, max: 9 },
      intelligence: { min: 5, max: 8 },
      agility: { min: 5, max: 8 },
      luck: { min: 4, max: 8 }
    }
  },
  hunter: {
    tagSkills: {
      smallGuns: 0.8,
      stealth: 0.7,
      survival: 0.9,
      perceptionSkill: 0.6
    },
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
  survivor: {
    tagSkills: {
      survival: 0.9,
      aid: 0.7,
      stealth: 0.6,
      physical: 0.5
    },
    special: {
      strength: { min: 4, max: 7 },
      perception: { min: 4, max: 7 },
      endurance: { min: 5, max: 8 },
      charisma: { min: 3, max: 6 },
      intelligence: { min: 4, max: 7 },
      agility: { min: 4, max: 7 },
      luck: { min: 3, max: 6 }
    }
  },
  scavenger: {
    tagSkills: {
      stealth: 0.8,
      survival: 0.7,
      steal: 0.6,
      manipulation: 0.5
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
    tagSkills: {
      survival: 0.9,
      physical: 0.7,
      unarmed: 0.6,
      reflexion: 0.5
    },
    special: {
      strength: { min: 4, max: 7 },
      perception: { min: 4, max: 7 },
      endurance: { min: 5, max: 8 },
      charisma: { min: 3, max: 6 },
      intelligence: { min: 3, max: 6 },
      agility: { min: 4, max: 7 },
      luck: { min: 3, max: 6 }
    }
  },
  civilian: {
    tagSkills: {
      speech: 0.6,
      barter: 0.5,
      survival: 0.4,
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
    }
  }
}

export default humanTemplates
