export type AmmoType =
  | "44"
  | "45"
  | "50"
  | "223"
  | "303"
  | "10mm"
  | "12g"
  | "14mm"
  | "30_06"
  | "40mm"
  | "5_56mm"
  | "7_62mm"
  | "9mm"
  | "bb"
  | "bolt"
  | "darts"
  | "ec2mm"
  | "energyCell"
  | "gas"
  | "hci"
  | "microFusion"
  | "missile"
  | "shell60mm"
  | "special"

export type Ammo = {
  [key in AmmoType]: number
}
