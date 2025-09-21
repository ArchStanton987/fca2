import { KnowledgeId } from "lib/character/abilities/knowledges/knowledge-types"
import { SkillId } from "lib/character/abilities/skills/skills.types"
import { EffectId } from "lib/character/effects/effects.types"
import { Modifier } from "lib/character/effects/symptoms.type"

import { AmmoType } from "../ammo/ammo.types"

export type BeastAttack = {
  name: string
  weaponId?: WeaponId
  skill: number // percentage
  apCost: number
  damage: string // dice roll string (e.g., '1d6', '2d4+2')
  effects?: EffectId[]
  modifiers?: Modifier[]
}

export type WeaponUseType = "basic" | "burst" | "aim" | "hit" | "throw"

export type WeaponActionId = WeaponUseType | "reload" | "unload"

export type DamageTypeId = "physical" | "laser" | "plasma" | "fire" | "other"
type DamageType = {
  id: DamageTypeId
  label: string
  short: string
}
export const damageTypeMap: Record<DamageTypeId, DamageType> = {
  physical: {
    id: "physical",
    label: "Physique",
    short: "Phy"
  },
  laser: {
    id: "laser",
    label: "Laser",
    short: "Las"
  },
  plasma: {
    id: "plasma",
    label: "Plasma",
    short: "Pla"
  },
  fire: {
    id: "fire",
    label: "Feu",
    short: "Feu"
  },
  other: {
    id: "other",
    label: "Autre",
    short: "Autr"
  }
}

export type DbWeaponData = {
  id: WeaponId
  label: string
  img: string
  damageType: DamageTypeId
  damageBasic?: string
  damageBurst?: string
  ammoType?: AmmoType
  range?: number
  magazine?: number
  ammoPerShot?: number
  ammoPerBurst?: number
  basicApCost?: number
  specialApCost?: number
  minStrength: number
  place: number
  weight: number
  value: number
  frequency: number
  skillId: SkillId
  knowledges: Partial<Record<KnowledgeId, KnowledgeId>>
  tags: Partial<Record<WeaponTagId, WeaponTagId>>
  isTwoHanded: boolean
}

export type WeaponData = {
  id: WeaponId
  label: string
  img: string
  damageType: DamageTypeId
  damageBasic: string | null
  damageBurst: string | null
  ammoType: AmmoType | null
  range: number | null
  magazine: number | null
  ammoPerShot: number | null
  ammoPerBurst: number | null
  basicApCost: number | null
  specialApCost: number | null
  minStrength: number
  place: number
  weight: number
  value: number
  frequency: number
  skillId: SkillId
  knowledges: KnowledgeId[]
  tags: WeaponTagId[]
  isTwoHanded: boolean
}

// export type Weapon = {
//   id: WeaponId
//   category: "weapon"
//   dbKey: string
//   skill: number
//   isEquiped: boolean
//   data: WeaponData
//   ammo: number
//   inMagazine?: number
//   effects: EffectId[]
//   modifiers: Modifier[]
// }

export type WeaponId =
  | "unarmed"
  | "10mm"
  | "p220"
  | "mauserHSI"
  | "berettaM92FS"
  | "browningHP"
  | "colt45"
  | "desertEagle"
  | "sigSauer338"
  | "223Auto"
  | "44Magnum"
  | "revolverCasul"
  | "smithWessonM29"
  | "skorpion"
  | "walterMpl"
  | "HKMP9"
  | "uzi"
  | "p90"
  | "pkk12"
  | "acidPistol"
  | "grenadePistol"
  | "seryngePistol"
  | "incendiaryPistol"
  | "coltRangemaster"
  | "garandM1"
  | "dks50"
  | "dks70"
  | "dragunov"
  | "gaussM72"
  | "redRyderLEBB"
  | "redRyderSEBB"
  | "tromblon"
  | "winchester1895"
  | "sawedShotgun"
  | "berettaSilverhawk"
  | "12gRiffle"
  | "fmNeostead"
  | "winchesterCityKiller"
  | "hkCaws"
  | "pancor"
  | "calicoM950"
  | "calicoLiberty100"
  | "rugerAC556f"
  | "mp38"
  | "mp5"
  | "greaseGun"
  | "sten"
  | "thomsonM1928"
  | "m16A1"
  | "ak47"
  | "famasG2"
  | "ak112"
  | "enfieldXL"
  | "garandM14"
  | "fnFAL"
  | "steyrAug"
  | "g36K"
  | "l85A1"
  | "m79"
  | "bren"
  | "lewisMkII"
  | "m60"
  | "m249"
  | "browningM2"
  | "CZ4000"
  | "avenger"
  | "vindicator"
  | "gaussMinigun"
  | "bazooka"
  | "m224"
  | "alienBlaster"
  | "glock86Plasma"
  | "glock96Plasma"
  | "wattz1000"
  | "wattz1600"
  | "solarScorcher"
  | "yk32"
  | "p94"
  | "p96"
  | "iemRiffle"
  | "iemYK42B"
  | "wattz2000"
  | "gatlingLaser"
  | "flamer450"
  | "flamer450MKII"
  | "bowingGloves"
  | "brassKnuckles"
  | "spikedKnuckles"
  | "sappers"
  | "lacerator"
  | "maceGlove"
  | "razorClaws"
  | "powerFist"
  | "megaPowerFist"
  | "cattleStick"
  | "sharpenedPole"
  | "scalpel"
  | "club"
  | "baseball"
  | "spear"
  | "javelin"
  | "wrench"
  | "crowbar"
  | "knife"
  | "combatKnife"
  | "cleaver"
  | "sword"
  | "hammer"
  | "machete"
  | "wakizachi"
  | "ripper"
  | "chainsaw"
  | "electricHammer"
  | "sldgeHammer"
  | "superSledge"
  | "crossbow"
  | "boomerang"
  | "molotof"
  | "dart"
  | "throwingKnife"
  | "shuriken"
  | "fantasyBall"
  | "flashGrenade"
  | "fragGrenade"
  | "incendiaryGenade"
  | "acidGenade"
  | "iemGrenade"
  | "plasmaGrenade"
  | "puffer"
  | "c4"
  | "plastic"
  | "claymore"
  | "dynamite"
  | "explosiveTrap"
  | "acidMineT86"
  | "t13mine"
  | "iemMine"
  | "t45SEMine"

export type WeaponTagId =
  | "mains nues"
  | "arme de mélée"
  | "arme de jet"
  | "arme à distance"
  | "piège"
  | "arme perforante"
  | "arme tranchante"
  | "arme contondante"
  | "arme à feu"
  | "arme à énergie"
  | "explosif"
  | "spécial"
  | "arme légère"
  | "arme moyenne"
  | "arme lourde"
  | "pistolet"
  | "revolver"
  | "pistolet mitrailleur"
  | "fusil"
  | "sniper"
  | "fusil à pompe"
  | "fusil d'assault"
  | "mitrailleuse lourde"
  | "minigun"
