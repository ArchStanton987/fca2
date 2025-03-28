import { NonHumanEnemyTemplate } from "../enemy.types"

const beasts: Record<string, NonHumanEnemyTemplate> = {
  giantRat: {
    templateId: "giantRat",
    label: "Rat Géant",
    hp: 12,
    actionPoints: 6,
    mentalStrength: 2,
    critChance: 3,
    armorClass: 5,
    resistances: {
      physicalDamageResist: 0,
      laserDamageResist: 0,
      fireDamageResist: 0,
      plasmaDamageResist: 0,
      poisResist: 25,
      radsResist: 20
    },
    attacks: [
      { name: "Griffe", skill: 70, apCost: 3, damage: "1d6" },
      { name: "Mords", skill: 75, apCost: 4, damage: "1d6+2", effects: ["poisonRadRatVenom"] }
    ]
  },
  radRat: {
    templateId: "radRat",
    label: "RadRat",
    hp: 10,
    actionPoints: 6,
    mentalStrength: 2,
    critChance: 3,
    armorClass: 3,
    resistances: {
      physicalDamageResist: 0,
      laserDamageResist: 0,
      fireDamageResist: 0,
      plasmaDamageResist: 0,
      poisResist: 50,
      radsResist: 80
    },
    attacks: [
      {
        name: "Griffe",
        skill: 70,
        apCost: 3,
        damage: "1d4",
        modifiers: [{ operation: "add", id: "rads", value: 5 }]
      },
      {
        name: "Mords",
        skill: 75,
        apCost: 4,
        damage: "1d4+2",
        modifiers: [{ operation: "add", id: "rads", value: 5 }]
      }
    ]
  },
  standardMolerat: {
    templateId: "standardMolerat",
    label: "Molerat standard",
    hp: 15,
    actionPoints: 7,
    mentalStrength: 3,
    critChance: 3,
    armorClass: 7,
    resistances: {
      physicalDamageResist: 5,
      laserDamageResist: 0,
      fireDamageResist: 5,
      plasmaDamageResist: 0,
      poisResist: 50,
      radsResist: 50
    },
    attacks: [
      { name: "Griffe", skill: 80, apCost: 3, damage: "1d6" },
      { name: "Mords", skill: 75, apCost: 4, damage: "1d6+3", effects: ["poisonLightBeast"] }
    ]
  },
  powerfulMolerat: {
    templateId: "powerfulMolerat",
    label: "Molerat puissant",
    hp: 30,
    actionPoints: 7,
    mentalStrength: 5,
    critChance: 5,
    armorClass: 11,
    resistances: {
      physicalDamageResist: 15,
      laserDamageResist: 5,
      fireDamageResist: 10,
      plasmaDamageResist: 0,
      poisResist: 60,
      radsResist: 60
    },
    attacks: [
      { name: "Griffe", skill: 90, apCost: 3, damage: "1d10+3" },
      { name: "Mords", skill: 90, apCost: 4, damage: "1d10", effects: ["poisonMedBeast"] }
    ]
  },
  standardPigrat: {
    templateId: "standardPigrat",
    label: "Pigrat standard",
    hp: 20,
    actionPoints: 7,
    mentalStrength: 3,
    critChance: 4,
    armorClass: 8,
    resistances: {
      physicalDamageResist: 5,
      laserDamageResist: 0,
      fireDamageResist: 0,
      plasmaDamageResist: 0,
      poisResist: 50,
      radsResist: 30
    },
    attacks: [
      { name: "Griffe", skill: 75, apCost: 3, damage: "2d4" },
      { name: "Mords", skill: 75, apCost: 4, damage: "2d4", effects: ["poisonLightBeast"] }
    ]
  },
  powerfulPigrat: {
    templateId: "powerfulPigrat",
    label: "Pigrat puissant",
    hp: 30,
    actionPoints: 9,
    mentalStrength: 5,
    critChance: 6,
    armorClass: 12,
    resistances: {
      physicalDamageResist: 15,
      laserDamageResist: 5,
      fireDamageResist: 10,
      plasmaDamageResist: 0,
      poisResist: 70,
      radsResist: 40
    },
    attacks: [
      { name: "Griffe", skill: 90, apCost: 3, damage: "2d6+2" },
      { name: "Mords", skill: 75, apCost: 6, damage: "2d6+4", effects: ["poisonMedBeast"] }
    ]
  },
  radRoach: {
    templateId: "radRoach",
    label: "Rad-cafard",
    hp: 15,
    actionPoints: 6,
    mentalStrength: 4,
    critChance: 4,
    armorClass: 3,
    resistances: {
      physicalDamageResist: 5,
      laserDamageResist: 0,
      fireDamageResist: 0,
      plasmaDamageResist: 0,
      poisResist: 100,
      radsResist: 100
    },
    attacks: [
      {
        name: "Mandibles",
        skill: 60,
        apCost: 3,
        damage: "1d6+2",
        effects: ["poisonLightBeast"]
      }
    ]
  },
  giantAnt: {
    templateId: "giantAnt",
    label: "Fourmi géante",
    hp: 20,
    actionPoints: 6,
    mentalStrength: 5,
    critChance: 3,
    armorClass: 2,
    resistances: {
      physicalDamageResist: 0,
      laserDamageResist: 0,
      fireDamageResist: 0,
      plasmaDamageResist: 0,
      poisResist: 100,
      radsResist: 60
    },
    attacks: [{ name: "Mandibles", skill: 65, apCost: 3, damage: "1d6+5" }]
  },
  fireAnt: {
    templateId: "fireAnt",
    label: "Fourmi de feu",
    hp: 30,
    actionPoints: 6,
    mentalStrength: 6,
    critChance: 4,
    armorClass: 5,
    resistances: {
      physicalDamageResist: 0,
      laserDamageResist: 0,
      fireDamageResist: 75,
      plasmaDamageResist: 0,
      poisResist: 100,
      radsResist: 70
    },
    attacks: [
      { name: "Mandibles", skill: 65, apCost: 3, damage: "1d6+5" },
      {
        name: "Fire Mords",
        skill: 70,
        apCost: 6,
        damage: "3d6+3"
      }
    ]
  },
  mantis: {
    templateId: "mantis",
    label: "Mante",
    hp: 10,
    actionPoints: 7,
    mentalStrength: 3,
    critChance: 2,
    armorClass: 3,
    resistances: {
      physicalDamageResist: 0,
      laserDamageResist: 0,
      fireDamageResist: 0,
      plasmaDamageResist: 0,
      poisResist: 75,
      radsResist: 80
    },
    attacks: [
      {
        name: "Mandibles",
        skill: 70,
        apCost: 3,
        damage: "2d6",
        effects: ["poisonLightBeast"]
      },
      { name: "Griffe", skill: 75, apCost: 4, damage: "2d6+2" }
    ]
  },
  mutantFly: {
    templateId: "mutantFly",
    label: "Mouche mutante",
    hp: 20,
    actionPoints: 9,
    mentalStrength: 3,
    critChance: 3,
    armorClass: 6,
    resistances: {
      physicalDamageResist: 10,
      laserDamageResist: 0,
      fireDamageResist: 0,
      plasmaDamageResist: 0,
      poisResist: 50,
      radsResist: 30
    },
    attacks: [
      { name: "Stinger", skill: 75, apCost: 5, damage: "1d6+3", effects: ["poisonMedBeast"] },
      { name: "Mords", skill: 60, apCost: 4, damage: "1d6+5" }
    ]
  },
  brahmin: {
    templateId: "brahmin",
    label: "Brahmine",
    hp: 60,
    actionPoints: 6,
    mentalStrength: 2,
    critChance: 2,
    armorClass: 20,
    resistances: {
      physicalDamageResist: 20,
      laserDamageResist: 0,
      fireDamageResist: 10,
      plasmaDamageResist: 0,
      poisResist: 30,
      radsResist: 60
    },
    attacks: [
      { name: "Horn Charge", skill: 75, apCost: 3, damage: "4d6+3" },
      { name: "Trample", skill: 65, apCost: 6, damage: "4d6+10" }
    ]
  },
  floater: {
    templateId: "floater",
    label: "Floater",
    hp: 65,
    actionPoints: 9,
    mentalStrength: 8,
    critChance: 7,
    armorClass: 12,
    resistances: {
      physicalDamageResist: 30,
      laserDamageResist: 10,
      fireDamageResist: 70,
      plasmaDamageResist: 10,
      poisResist: 80,
      radsResist: 80
    },
    attacks: [
      {
        name: "Whip",
        skill: 85,
        apCost: 4,
        damage: "2d6+8",
        modifiers: [{ operation: "add", id: "rads", value: 10 }]
      }
    ]
  },
  centaur: {
    templateId: "centaur",
    label: "Centaure",
    hp: 80,
    actionPoints: 6,
    mentalStrength: 11,
    critChance: 6,
    armorClass: 20,
    resistances: {
      physicalDamageResist: 70,
      laserDamageResist: 10,
      fireDamageResist: 40,
      plasmaDamageResist: 10,
      poisResist: 70,
      radsResist: 80
    },
    attacks: [
      {
        name: "Kick",
        skill: 90,
        apCost: 5,
        damage: "1d20+8",
        modifiers: [{ operation: "add", id: "rads", value: 5 }]
      },
      {
        name: "Spit",
        skill: 70,
        apCost: 4,
        damage: "3d6+5",
        modifiers: [{ operation: "add", id: "rads", value: 15 }]
      }
    ]
  },
  radScorpion: {
    templateId: "radScorpion",
    label: "Radscorpion",
    hp: 20,
    actionPoints: 7,
    mentalStrength: 5,
    critChance: 4,
    armorClass: 10,
    resistances: {
      physicalDamageResist: 5,
      laserDamageResist: 0,
      fireDamageResist: 10,
      plasmaDamageResist: 0,
      poisResist: 100,
      radsResist: 80
    },
    attacks: [
      {
        name: "Stinger",
        skill: 70,
        apCost: 5,
        damage: "1d10+2",
        effects: ["poisonRadScorpionLightVenom"]
      },
      { name: "Claw", skill: 60, apCost: 3, damage: "1d6" }
    ]
  },
  giantRadScorpion: {
    templateId: "giantRadScorpion",
    label: "Radscorpion géant",
    hp: 85,
    actionPoints: 8,
    mentalStrength: 6,
    critChance: 6,
    armorClass: 15,
    resistances: {
      physicalDamageResist: 15,
      laserDamageResist: 5,
      fireDamageResist: 20,
      plasmaDamageResist: 5,
      poisResist: 100,
      radsResist: 90
    },
    attacks: [
      {
        name: "Stinger",
        skill: 85,
        apCost: 5,
        damage: "2d10+8",
        effects: ["poisonRadScorpionMedVenom"]
      },
      { name: "Claw", skill: 75, apCost: 3, damage: "1d10" }
    ]
  },
  grayWolf: {
    templateId: "grayWolf",
    label: "Loup gris",
    hp: 30,
    actionPoints: 6,
    mentalStrength: 7,
    critChance: 5,
    armorClass: 7,
    resistances: {
      physicalDamageResist: 10,
      laserDamageResist: 0,
      fireDamageResist: 5,
      plasmaDamageResist: 0,
      poisResist: 25,
      radsResist: 15
    },
    attacks: [
      { name: "Mords", skill: 80, apCost: 4, damage: "3d6" },
      { name: "Griffe", skill: 70, apCost: 3, damage: "1d6+3" }
    ]
  },
  furiousWolf: {
    templateId: "furiousWolf",
    label: "Loup furieux",
    hp: 60,
    actionPoints: 8,
    mentalStrength: 9,
    critChance: 7,
    armorClass: 9,
    resistances: {
      physicalDamageResist: 15,
      laserDamageResist: 0,
      fireDamageResist: 5,
      plasmaDamageResist: 0,
      poisResist: 40,
      radsResist: 20
    },
    attacks: [
      { name: "Mords", skill: 90, apCost: 4, damage: "3d6+5" },
      {
        name: "Griffe",
        skill: 80,
        apCost: 3,
        damage: "1d10+5"
      }
    ]
  },
  wildDog: {
    templateId: "wildDog",
    label: "Chien sauvage",
    hp: 30,
    actionPoints: 6,
    mentalStrength: 3,
    critChance: 4,
    armorClass: 5,
    resistances: {
      physicalDamageResist: 5,
      laserDamageResist: 0,
      fireDamageResist: 5,
      plasmaDamageResist: 0,
      poisResist: 15,
      radsResist: 10
    },
    attacks: [
      {
        name: "Mords",
        skill: 70,
        apCost: 3,
        damage: "2d6"
      }
    ]
  },
  babyDeathclaw: {
    templateId: "babyDeathclaw",
    label: "Bébé Griffemort",
    hp: 45,
    actionPoints: 6,
    mentalStrength: 20,
    critChance: 8,
    armorClass: 30,
    resistances: {
      physicalDamageResist: 50,
      laserDamageResist: 5,
      fireDamageResist: 40,
      plasmaDamageResist: 5,
      poisResist: 80,
      radsResist: 60
    },
    attacks: [{ name: "Griffe", skill: 70, apCost: 4, damage: "4d6" }]
  },
  adultDeathclaw: {
    templateId: "adultDeathclaw",
    label: "Griffemort adulte",
    hp: 105,
    actionPoints: 10,
    mentalStrength: 20,
    critChance: 9,
    armorClass: 35,
    resistances: {
      physicalDamageResist: 50,
      laserDamageResist: 10,
      fireDamageResist: 40,
      plasmaDamageResist: 10,
      poisResist: 80,
      radsResist: 60
    },
    attacks: [{ name: "Griffe", skill: 90, apCost: 5, damage: "5d6+5" }]
  },
  alphaFemaleDeathclaw: {
    templateId: "alphaFemaleDeathclaw",
    label: "Femelle Alpha Griffemort",
    hp: 170,
    actionPoints: 12,
    mentalStrength: 30,
    critChance: 12,
    armorClass: 35,
    resistances: {
      physicalDamageResist: 50,
      laserDamageResist: 10,
      fireDamageResist: 40,
      plasmaDamageResist: 10,
      poisResist: 80,
      radsResist: 60
    },
    attacks: [{ name: "Griffe", skill: 110, apCost: 5, damage: "4d10+5" }]
  },

  babySpitter: {
    templateId: "babySpitter",
    label: "Bébé plante",
    hp: 25,
    actionPoints: 8,
    mentalStrength: 4,
    critChance: 2,
    armorClass: 5,
    resistances: {
      physicalDamageResist: 0,
      laserDamageResist: 0,
      fireDamageResist: 0,
      plasmaDamageResist: 0,
      poisResist: 100,
      radsResist: 80
    },
    attacks: [
      {
        name: "Venin",
        skill: 75,
        apCost: 4,
        damage: "1d6+3",
        effects: ["poisonLightBeast"]
      }
    ]
  },
  adultSpitter: {
    templateId: "adultSpitter",
    label: "Plante adulte",
    hp: 35,
    actionPoints: 8,
    mentalStrength: 5,
    critChance: 3,
    armorClass: 5,
    resistances: {
      physicalDamageResist: 0,
      laserDamageResist: 0,
      fireDamageResist: 0,
      plasmaDamageResist: 0,
      poisResist: 100,
      radsResist: 95
    },
    attacks: [
      {
        name: "Venin",
        skill: 85,
        apCost: 4,
        damage: "2d6+3",
        effects: ["poisonLightBeast"]
      }
    ]
  },
  gecko: {
    templateId: "gecko",
    label: "Gecko",
    hp: 40,
    actionPoints: 7,
    mentalStrength: 2,
    critChance: 8,
    armorClass: 10,
    resistances: {
      physicalDamageResist: 0,
      laserDamageResist: 0,
      fireDamageResist: 0,
      plasmaDamageResist: 0,
      poisResist: 80,
      radsResist: 75
    },
    attacks: [
      {
        name: "Griffure",
        skill: 75,
        apCost: 3,
        damage: "1d10+3"
      },
      {
        name: "Morsure",
        skill: 70,
        apCost: 4,
        damage: "2d6+3"
      }
    ]
  },
  fireGecko: {
    templateId: "fireGecko",
    label: "Gecko de feu",
    hp: 55,
    actionPoints: 8,
    mentalStrength: 12,
    critChance: 4,
    armorClass: 10,
    resistances: {
      physicalDamageResist: 30,
      laserDamageResist: 0,
      fireDamageResist: 75,
      plasmaDamageResist: 0,
      poisResist: 90,
      radsResist: 80
    },
    attacks: [
      {
        name: "Griffure",
        skill: 75,
        apCost: 3,
        damage: "1d10+7"
      },
      {
        name: "Crache-flammes",
        skill: 80,
        apCost: 6,
        damage: "3d6+10"
      }
    ]
  },
  goldenGecko: {
    templateId: "goldenGecko",
    label: "Gecko doré",
    hp: 70,
    actionPoints: 9,
    mentalStrength: 15,
    critChance: 5,
    armorClass: 15,
    resistances: {
      physicalDamageResist: 50,
      laserDamageResist: 10,
      fireDamageResist: 50,
      plasmaDamageResist: 10,
      poisResist: 100,
      radsResist: 100
    },
    attacks: [
      {
        name: "Griffure",
        skill: 90,
        apCost: 3,
        damage: "1d10+9"
      },
      {
        name: "Morsure",
        skill: 85,
        apCost: 5,
        damage: "2D6+12"
      }
    ]
  },
  yaoGuai: {
    templateId: "yaoGuai",
    label: "Yao Guai",
    hp: 155,
    actionPoints: 10,
    mentalStrength: 20,
    critChance: 9,
    armorClass: 40,
    resistances: {
      physicalDamageResist: 20,
      laserDamageResist: 15,
      fireDamageResist: 30,
      plasmaDamageResist: 10,
      poisResist: 80,
      radsResist: 60
    },
    attacks: [
      {
        name: "Griffures",
        skill: 90,
        apCost: 4,
        damage: "6d6+10"
      }
    ]
  },
  mirelurk: {
    templateId: "mirelurk",
    label: "Mirelurk (crabe des bourbiers)",
    hp: 20,
    actionPoints: 7,
    mentalStrength: 7,
    critChance: 2,
    armorClass: 20,
    resistances: {
      physicalDamageResist: 30,
      laserDamageResist: 20,
      fireDamageResist: 20,
      plasmaDamageResist: 20,
      poisResist: 60,
      radsResist: 75
    },
    attacks: [
      {
        name: "Pinces",
        skill: 80,
        apCost: 3,
        damage: "2d10",
        modifiers: [{ operation: "add", id: "rads", value: 5 }]
      }
    ]
  },
  mirelurking: {
    templateId: "mirelurking",
    label: "Mirelurk King (Seigneur crabe des bourbiers)",
    hp: 65,
    actionPoints: 7,
    mentalStrength: 10,
    critChance: 5,
    armorClass: 30,
    resistances: {
      physicalDamageResist: 50,
      laserDamageResist: 20,
      fireDamageResist: 20,
      plasmaDamageResist: 20,
      poisResist: 60,
      radsResist: 75
    },
    attacks: [
      {
        name: "Pinces",
        skill: 90,
        apCost: 3,
        damage: "2d10+5",
        modifiers: [{ operation: "add", id: "rads", value: 5 }]
      },
      {
        name: "Morsure",
        skill: 80,
        apCost: 5,
        damage: "3D10",
        modifiers: [{ operation: "add", id: "rads", value: 10 }]
      }
    ]
  },
  weakFeralGhoul: {
    templateId: "weakFeralGhoul",
    label: "Goule sauvage faible",
    hp: 30,
    actionPoints: 5,
    mentalStrength: 4,
    critChance: 3,
    armorClass: 5,
    resistances: {
      physicalDamageResist: 10,
      laserDamageResist: 5,
      fireDamageResist: 20,
      plasmaDamageResist: 5,
      poisResist: 70,
      radsResist: 90
    },
    attacks: [
      {
        name: "Griffure",
        skill: 70,
        apCost: 3,
        damage: "1d6+5",
        modifiers: [{ operation: "add", id: "rads", value: 5 }]
      },
      {
        name: "Ruade",
        skill: 65,
        apCost: 6,
        damage: "3D6",
        modifiers: [{ operation: "add", id: "rads", value: 7 }]
      }
    ]
  },
  furiousFeralGhoul: {
    templateId: "furiousFeralGhoul",
    label: "Goule sauvage furieuse",
    hp: 40,
    actionPoints: 6,
    mentalStrength: 6,
    critChance: 4,
    armorClass: 5,
    resistances: {
      physicalDamageResist: 10,
      laserDamageResist: 5,
      fireDamageResist: 20,
      plasmaDamageResist: 5,
      poisResist: 70,
      radsResist: 90
    },
    attacks: [
      {
        name: "Griffure",
        skill: 75,
        apCost: 3,
        damage: "1d6+8",
        modifiers: [{ operation: "add", id: "rads", value: 5 }]
      },
      {
        name: "Ruade",
        skill: 65,
        apCost: 6,
        damage: "3D6+3",
        modifiers: [{ operation: "add", id: "rads", value: 7 }]
      }
    ]
  },
  glowingFeralGhoul: {
    templateId: "glowingFeralGhoul",
    label: "Goule sauvage luminescente",
    hp: 45,
    actionPoints: 6,
    mentalStrength: 6,
    critChance: 5,
    armorClass: 8,
    resistances: {
      physicalDamageResist: 10,
      laserDamageResist: 10,
      fireDamageResist: 30,
      plasmaDamageResist: 10,
      poisResist: 80,
      radsResist: 100
    },
    attacks: [
      {
        name: "Griffure",
        skill: 80,
        apCost: 3,
        damage: "1d6+8",
        modifiers: [{ operation: "add", id: "rads", value: 8 }]
      },
      {
        name: "Ruade",
        skill: 75,
        apCost: 6,
        damage: "3D6+3",
        modifiers: [{ operation: "add", id: "rads", value: 10 }]
      }
    ]
  }
}

export default beasts
