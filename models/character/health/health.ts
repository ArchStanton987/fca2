import { HealthStatusId, HealthType } from "models/character/health/health-types"

const healthMap: Record<HealthStatusId, HealthType> = {
  hp: {
    id: "hp",
    label: "Points de vie",
    short: "PV",
    minValue: -1000,
    maxValue: 10000
  },
  headHp: {
    id: "headHp",
    label: "PV tête",
    short: "PVtê",
    minValue: 0,
    maxValue: 15
  },
  leftTorsoHp: {
    id: "leftTorsoHp",
    label: "PV torse",
    short: "PVto",
    minValue: 0,
    maxValue: 25
  },
  rightTorsoHp: {
    id: "rightTorsoHp",
    label: "PV torse",
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
  poison: {
    id: "poison",
    label: "Poison",
    short: "Pois",
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
