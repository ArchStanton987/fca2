import { Ammo, AmmoType } from "./ammo-types"

const ammo: Record<AmmoType, Ammo> = {
  "44": {
    id: "44",
    label: ".44"
  },
  "45": {
    id: "45",
    label: ".45"
  },
  "50": {
    id: "50",
    label: ".50"
  },
  "223": {
    id: "223",
    label: ".223"
  },
  "303": {
    id: "303",
    label: ".303"
  },
  "10mm": {
    id: "10mm",
    label: "10mm"
  },
  "12g": {
    id: "12g",
    label: "12g"
  },
  "14mm": {
    id: "14mm",
    label: "14mm"
  },
  "30_06": {
    id: "30_06",
    label: "30.06"
  },
  "40mm": {
    id: "40mm",
    label: "40mm"
  },
  "5_56mm": {
    id: "5_56mm",
    label: "5.56mm"
  },
  "7_62mm": {
    id: "7_62mm",
    label: "7.62mm"
  },
  "9mm": {
    id: "9mm",
    label: "9mm"
  },
  bb: {
    id: "bb",
    label: "BB"
  },
  bolt: {
    id: "bolt",
    label: "Carreaux"
  },
  darts: {
    id: "darts",
    label: "Flechettes"
  },
  ec2mm: {
    id: "ec2mm",
    label: "EC 2mm"
  },
  energyCell: {
    id: "energyCell",
    label: "Cell. à énergie"
  },
  gas: {
    id: "gas",
    label: "Gas"
  },
  hci: {
    id: "hci",
    label: "HCI"
  },
  microFusion: {
    id: "microFusion",
    label: "Cell. microfusion"
  },
  missile: {
    id: "missile",
    label: "Roquette"
  },
  shell60mm: {
    id: "shell60mm",
    label: "Obus 60mm"
  },
  special: {
    id: "special",
    label: "Special"
  }
}

export default ammo
