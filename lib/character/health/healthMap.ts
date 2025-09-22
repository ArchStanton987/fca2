import { HealthStatusId, HealthType } from "./health-types"
import { LimbData, LimbId } from "./limbs"

export const limbsMap: Record<LimbId, LimbData> = {
  head: {
    id: "head",
    cripledEffectId: "crippledHead",
    label: "Tête",
    maxHp: 15,
    aim: {
      aimMalus: 30,
      critBonus: 30
    }
  },
  leftArm: {
    id: "leftArm",
    cripledEffectId: "crippledLeftArm",
    label: "Bras gauche",
    maxHp: 20,
    aim: {
      aimMalus: 10,
      critBonus: 10
    }
  },
  rightArm: {
    id: "rightArm",
    cripledEffectId: "crippledRightArm",
    label: "Bras droit",
    maxHp: 20,
    aim: {
      aimMalus: 10,
      critBonus: 10
    }
  },
  leftTorso: {
    id: "leftTorso",
    cripledEffectId: "crippledLeftTorso",
    label: "Torse gauche",
    maxHp: 25,
    aim: {
      aimMalus: 0,
      critBonus: 0
    }
  },
  rightTorso: {
    id: "rightTorso",
    cripledEffectId: "crippledRightTorso",
    label: "Torse droit",
    maxHp: 30,
    aim: {
      aimMalus: 0,
      critBonus: 0
    }
  },
  groin: {
    id: "groin",
    crippledEffectId: "crippledGroin",
    label: "Entrejambe",
    maxHp: 15,
    aim: {
      aimMalus: 30,
      critBonus: 30
    }
  },
  leftLeg: {
    id: "leftLeg",
    crippledEffectId: "crippledLeftLeg",
    label: "Jambe gauche",
    maxHp: 20,
    aim: {
      aimMalus: 10,
      critBonus: 10
    }
  },
  rightLeg: {
    id: "rightLeg",
    crippledEffectId: "crippledRightLeg",
    label: "Jambe droite",
    maxHp: 20,
    aim: {
      aimMalus: 10,
      critBonus: 10
    }
  }
}

export const limbsDefault = Object.values(limbsMap).reduce((acc, curr) => {
  acc[curr.id] = curr.maxValue
  return acc
}, {} as Record<LimbHpId, number>)

const healthMap: Record<HealthStatusId, HealthType> = {
  headHp: {
    id: "headHp",
    label: "PV tête",
    short: "PVtê",
    minValue: 0,
    maxValue: 15
  },
  leftTorsoHp: {
    id: "leftTorsoHp",
    label: "PV torse gauche",
    short: "PVto",
    minValue: 0,
    maxValue: 25
  },
  rightTorsoHp: {
    id: "rightTorsoHp",
    label: "PV torse droit",
    short: "PVto",
    minValue: 0,
    maxValue: 30
  },
  leftArmHp: {
    id: "leftArmHp",
    label: "PV bras gauche",
    short: "PVBrG",
    minValue: 0,
    maxValue: 20
  },
  rightArmHp: {
    id: "rightArmHp",
    label: "PV bras droit",
    short: "PVBrD",
    minValue: 0,
    maxValue: 20
  },
  leftLegHp: {
    id: "leftLegHp",
    label: "PV jambe gauche",
    short: "PVJaG",
    minValue: 0,
    maxValue: 20
  },
  rightLegHp: {
    id: "rightLegHp",
    label: "PV jambe droite",
    short: "PVJaD",
    minValue: 0,
    maxValue: 20
  },
  groinHp: {
    id: "groinHp",
    label: "PV entrejambe",
    short: "PVEnJ",
    minValue: 0,
    maxValue: 15
  },
  rads: {
    id: "rads",
    label: "Rads",
    short: "Rad",
    minValue: 0,
    maxValue: 1000
  }
}

export default healthMap
