import { HealthStatusId, HealthType } from "models/character/health/health-types"

const healthMap: Record<HealthStatusId, HealthType> = {
  hp: {
    id: "hp",
    label: "Points de vie",
    short: "PV"
  },
  headHp: {
    id: "headHp",
    label: "PV tête",
    short: "PVtê"
  },
  torsoHp: {
    id: "torsoHp",
    label: "PV torse",
    short: "PVto"
  },
  leftArmHp: {
    id: "leftArmHp",
    label: "PV bras gauche",
    short: "PVBrG"
  },
  rightArmHp: {
    id: "rightArmHp",
    label: "PV bras droit",
    short: "PVBrD"
  },
  leftLegHp: {
    id: "leftLegHp",
    label: "PV jambe gauche",
    short: "PVJaG"
  },
  rightLegHp: {
    id: "rightLegHp",
    label: "PV jambe droite",
    short: "PVJaD"
  },
  groinHp: {
    id: "groinHp",
    label: "PV entrejambe",
    short: "PVEnJ"
  },
  poison: {
    id: "poison",
    label: "Poison",
    short: "Pois"
  },
  rads: {
    id: "rads",
    label: "Rads",
    short: "Rad"
  }
}

export default healthMap
