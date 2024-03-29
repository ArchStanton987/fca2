import { AmmoData, AmmoType } from "./ammo.types"

const ammoMap: Record<AmmoType, AmmoData> = {
  "44": {
    id: "44",
    label: ".44",
    place: 0.01,
    weight: 0.01
  },
  "45": {
    id: "45",
    label: ".45",
    place: 0.02,
    weight: 0.01
  },
  "50": {
    id: "50",
    label: ".50",
    place: 0.04,
    weight: 0.02
  },
  "223": {
    id: "223",
    label: ".223",
    place: 0.02,
    weight: 0.01
  },
  "303": {
    id: "303",
    label: ".303",
    place: 0.02,
    weight: 0.01
  },
  "10mm": {
    id: "10mm",
    label: "10mm",
    place: 0.01,
    weight: 0.01
  },
  "12g": {
    id: "12g",
    label: "12g",
    place: 0.05,
    weight: 0.01
  },
  "14mm": {
    id: "14mm",
    label: "14mm",
    place: 0.01,
    weight: 0.01
  },
  "30_06": {
    id: "30_06",
    label: "30.06",
    place: 0.02,
    weight: 0.01
  },
  "40mm": {
    id: "40mm",
    label: "40mm",
    place: 1,
    weight: 1
  },
  "5_56mm": {
    id: "5_56mm",
    label: "5.56mm",
    place: 0.02,
    weight: 0.01
  },
  "7_62mm": {
    id: "7_62mm",
    label: "7.62mm",
    place: 0.02,
    weight: 0.01
  },
  "9mm": {
    id: "9mm",
    label: "9mm",
    place: 0.01,
    weight: 0.01
  },
  bb: {
    id: "bb",
    label: "BB",
    place: 0.01,
    weight: 0.01
  },
  bolt: {
    id: "bolt",
    label: "Carreaux",
    place: 0.04,
    weight: 0.01
  },
  darts: {
    id: "darts",
    label: "Flechettes",
    place: 0.04,
    weight: 0.01
  },
  ec2mm: {
    id: "ec2mm",
    label: "EC 2mm",
    place: 0.01,
    weight: 0.01
  },
  energyCell: {
    id: "energyCell",
    label: "Cell. à énergie",
    place: 0.04,
    weight: 0.01
  },
  gas: {
    id: "gas",
    label: "Gas",
    place: 0.02,
    weight: 0.02
  },
  hci: {
    id: "hci",
    label: "HCI",
    place: 0.01,
    weight: 0.01
  },
  microFusion: {
    id: "microFusion",
    label: "Cell. microfusion",
    place: 0.04,
    weight: 0.01
  },
  missile: {
    id: "missile",
    label: "Roquette",
    place: 2,
    weight: 2
  },
  shell60mm: {
    id: "shell60mm",
    label: "Obus 60mm",
    place: 0.06,
    weight: 0.06
  },
  special: {
    id: "special",
    label: "Special",
    place: 0.01,
    weight: 0.01
  }
}

export default ammoMap
