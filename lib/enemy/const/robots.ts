import { NonHumanEnemyTemplate } from "../enemy.types"

const robots: Record<string, NonHumanEnemyTemplate> = {
  mrHandy: {
    templateId: "mrHandy",
    label: "Mr Handy",
    hp: 44,
    actionPoints: 6,
    mentalStrength: 5,
    critChance: 3,
    armorClass: 12,
    resistances: {
      physicalDamageResist: 15,
      laserDamageResist: 5,
      fireDamageResist: 10,
      plasmaDamageResist: 5,
      poisResist: 100,
      radsResist: 100
    },
    attacks: [
      {
        name: "Corps à corps",
        skill: 80,
        apCost: 4,
        damage: "2d6+4"
      }
    ]
  },
  mrGutsy: {
    templateId: "mrGutsy",
    label: "Mr Gutsy",
    hp: 60,
    actionPoints: 6,
    mentalStrength: 7,
    critChance: 4,
    armorClass: 15,
    resistances: {
      physicalDamageResist: 20,
      laserDamageResist: 10,
      fireDamageResist: 15,
      plasmaDamageResist: 10,
      poisResist: 100,
      radsResist: 100
    },
    attacks: [
      {
        name: "Corps à corps",
        skill: 95,
        apCost: 4,
        damage: "2d6+6"
      },
      {
        name: "Lance-flammes",
        skill: 85,
        apCost: 6,
        damage: "4d6+10"
      }
    ]
  },
  sentinelRobotMkII: {
    templateId: "sentinelRobotMkII",
    label: "Robot Sentinelle MK II",
    hp: 85,
    actionPoints: 6,
    mentalStrength: 10,
    critChance: 5,
    armorClass: 25,
    resistances: {
      physicalDamageResist: 40,
      laserDamageResist: 30,
      fireDamageResist: 15,
      plasmaDamageResist: 25,
      poisResist: 100,
      radsResist: 100
    },
    attacks: [
      {
        name: "Lance-roquette léger",
        skill: 85,
        apCost: 6,
        damage: "7d6+20"
      },
      {
        name: "Mitrailleuse lourde",
        skill: 95,
        apCost: 6,
        damage: "5d6+15"
      }
    ]
  },
  enclaveEyebot: {
    templateId: "enclaveEyebot",
    label: "Eyebot de l'Enclave",
    hp: 25,
    actionPoints: 8,
    mentalStrength: 1,
    critChance: 1,
    armorClass: 5,
    resistances: {
      physicalDamageResist: 10,
      laserDamageResist: 5,
      fireDamageResist: 10,
      plasmaDamageResist: 5,
      poisResist: 100,
      radsResist: 100
    },
    attacks: [] // Pas d'attaques spécifiées dans le document
  },
  robotBrain: {
    templateId: "robotBrain",
    label: "Robot-Cerveau",
    hp: 70,
    actionPoints: 6,
    mentalStrength: 8,
    critChance: 4,
    armorClass: 18,
    resistances: {
      physicalDamageResist: 30,
      laserDamageResist: 20,
      fireDamageResist: 10,
      plasmaDamageResist: 20,
      poisResist: 100,
      radsResist: 100
    },
    attacks: [
      {
        name: "Fusil d'assault",
        skill: 80,
        apCost: 4,
        damage: "3d6+6"
      },
      {
        name: "Corps à corps",
        skill: 70,
        apCost: 4,
        damage: "2d6+2"
      }
    ]
  },
  robotBrainLeader: {
    templateId: "robotBrainLeader",
    label: "Chef Robot-Cerveau",
    hp: 90,
    actionPoints: 6,
    mentalStrength: 12,
    critChance: 5,
    armorClass: 18,
    resistances: {
      physicalDamageResist: 30,
      laserDamageResist: 20,
      fireDamageResist: 10,
      plasmaDamageResist: 20,
      poisResist: 100,
      radsResist: 100
    },
    attacks: [
      {
        name: "Pistolet mitrailleur",
        skill: 110,
        apCost: 6,
        damage: "5d6+12"
      },
      {
        name: "Fusil d'assault",
        skill: 110,
        apCost: 5,
        damage: "4d6+10"
      },
      {
        name: "Corps à corps",
        skill: 90,
        apCost: 4,
        damage: "2d6+2"
      }
    ]
  },
  cyberdog: {
    templateId: "cyberdog",
    label: "Cyberchien",
    hp: 60,
    actionPoints: 7,
    mentalStrength: 4,
    critChance: 3,
    armorClass: 10,
    resistances: {
      physicalDamageResist: 10,
      laserDamageResist: 10,
      fireDamageResist: 10,
      plasmaDamageResist: 5,
      poisResist: 100,
      radsResist: 100
    },
    attacks: [
      {
        name: "Griffes",
        skill: 70,
        apCost: 3,
        damage: "1d10+4"
      },
      {
        name: "Morsure",
        skill: 80,
        apCost: 5,
        damage: "3d6+1"
      }
    ]
  },
  militaryCyberdog: {
    templateId: "militaryCyberdog",
    label: "Cyberchien Militaire",
    hp: 70,
    actionPoints: 8,
    mentalStrength: 9,
    critChance: 4,
    armorClass: 12,
    resistances: {
      physicalDamageResist: 15,
      laserDamageResist: 10,
      fireDamageResist: 15,
      plasmaDamageResist: 10,
      poisResist: 100,
      radsResist: 100
    },
    attacks: [
      {
        name: "Griffes",
        skill: 80,
        apCost: 3,
        damage: "1d10+7"
      },
      {
        name: "Morsure",
        skill: 90,
        apCost: 5,
        damage: "3d6+5"
      }
    ]
  }
}

export default robots
