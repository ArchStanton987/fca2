import { Special } from "lib/character/abilities/special/special.types"
import ammoMap from "lib/objects/data/ammo/ammo"
import { Ammo, AmmoType } from "lib/objects/data/ammo/ammo.types"
import clothingsMap from "lib/objects/data/clothings/clothings"
import { Clothing, ClothingData, ClothingId } from "lib/objects/data/clothings/clothings.types"
import consumablesMap from "lib/objects/data/consumables/consumables"
import {
  Consumable,
  ConsumableData,
  ConsumableId
} from "lib/objects/data/consumables/consumables.types"
import miscObjectsMap from "lib/objects/data/misc-objects/misc-objects"
import {
  MiscObject,
  MiscObjectData,
  MiscObjectId
} from "lib/objects/data/misc-objects/misc-objects-types"
import { DbEquipedObjects, DbInventory } from "lib/objects/data/objects.types"
import { Weapon } from "lib/objects/data/weapons/weapons.types"
import { computed, makeObservable, observable } from "mobx"

import { filterUnique } from "utils/array-utils"

import { DbAbilities } from "../character/abilities/abilities.types"
import { SkillsValues } from "../character/abilities/skills/skills.types"
import { Symptom } from "../character/effects/symptoms.type"
import { CreatedElements, defaultCreatedElements } from "./created-elements"
import { dbToWeapon } from "./data/weapons/weapons.mappers"

type CharData = {
  dbAbilities: DbAbilities
  innateSymptoms: Symptom[]
  currSkills: SkillsValues
  currSpecial: Special
  dbEquipedObjects: DbEquipedObjects
}

type Carriable = {
  data: { weight: number; place: number }
  isEquiped?: boolean
  amount?: number
}

export default class Inventory {
  dbInventory: DbInventory
  charData: CharData
  allClothings: Record<ClothingId, ClothingData>
  allConsumables: Record<ConsumableId, ConsumableData>
  allMiscObjects: Record<MiscObjectId, MiscObjectData>

  constructor(
    dbInventory: DbInventory,
    charData: CharData,
    newElements: CreatedElements = defaultCreatedElements
  ) {
    const { newClothings, newConsumables, newMiscObjects } = newElements
    this.dbInventory = dbInventory
    this.charData = charData
    this.allClothings = { ...clothingsMap, ...newClothings }
    this.allConsumables = { ...consumablesMap, ...newConsumables }
    this.allMiscObjects = { ...miscObjectsMap, ...newMiscObjects }

    makeObservable(this, {
      dbInventory: observable,
      charData: observable,
      //
      weapons: computed,
      clothings: computed,
      consumables: computed,
      miscObjects: computed,
      ammo: computed,
      caps: computed,
      //
      weaponsRecord: computed,
      clothingsRecord: computed,
      consumablesRecord: computed,
      miscObjectsRecord: computed,
      ammoRecord: computed,
      //
      inventory: computed,
      //
      groupedConsumables: computed,
      groupedMiscObjects: computed,

      currentCarry: computed
    })
  }

  get weapons(): Weapon[] {
    return Object.entries(this.dbInventory.weapons || {}).map(entry =>
      dbToWeapon(entry, this.charData, this.dbInventory.ammo)
    )
  }

  get clothings(): Clothing[] {
    return Object.entries(this.dbInventory.clothings || []).map(([dbKey, { id }]) => {
      const isEquiped = this.charData.dbEquipedObjects?.clothings?.[dbKey] !== undefined
      return { data: this.allClothings[id], dbKey, id, isEquiped }
    })
  }

  get consumables(): Consumable[] {
    return Object.entries(this.dbInventory.consumables || []).map(([dbKey, value]) => ({
      data: this.allConsumables[value.id as ConsumableId],
      dbKey,
      id: value.id,
      remainingUse: value.remainingUse
    }))
  }

  get groupedConsumables(): (Consumable & { count: number })[] {
    return filterUnique(
      "id",
      this.consumables.map((consumable, _, currArr) => {
        const count = currArr.filter(el => el.id === consumable.id).length
        return { ...consumable, count }
      })
    )
  }

  get miscObjects(): MiscObject[] {
    return Object.entries(this.dbInventory.miscObjects || {}).map(([dbKey, { id }]) => ({
      data: this.allMiscObjects[id],
      dbKey,
      id
    }))
  }

  get groupedMiscObjects(): (MiscObject & { count: number })[] {
    return filterUnique(
      "id",
      this.miscObjects.map((consumable, _, currArr) => {
        const count = currArr.filter(el => el.id === consumable.id).length
        return { ...consumable, count }
      })
    )
  }

  get ammo(): Ammo[] {
    return (
      Object.entries(this.dbInventory.ammo || {})
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .filter(([_, amount]) => amount > 0)
        .map(([id, amount]) => ({ data: ammoMap[id as AmmoType], id: id as AmmoType, amount }))
        .sort((a, b) => b.amount - a.amount)
    )
  }

  get caps(): number {
    return this.dbInventory.caps || 0
  }

  get weaponsRecord() {
    const weaponsRecord: Record<string, Weapon> = {}
    this.weapons.forEach(record => {
      weaponsRecord[record.dbKey] = record
    })
    return weaponsRecord
  }

  get clothingsRecord() {
    const clothingsRecord: Record<string, Clothing> = {}
    this.clothings.forEach(record => {
      clothingsRecord[record.dbKey] = record
    })
    return clothingsRecord
  }

  get consumablesRecord() {
    const consumablesRecord: Record<string, Consumable> = {}
    this.consumables.forEach(record => {
      consumablesRecord[record.dbKey] = record
    })
    return consumablesRecord
  }

  get miscObjectsRecord() {
    const miscObjectsRecord: Record<string, MiscObject> = {}
    this.miscObjects.forEach(record => {
      miscObjectsRecord[record.dbKey] = record
    })
    return miscObjectsRecord
  }

  get ammoRecord() {
    const ammoRecord = {} as Record<AmmoType, number>
    this.ammo.forEach(record => {
      ammoRecord[record.id] = record.amount
    })
    return ammoRecord
  }

  get inventory() {
    return {
      weapons: this.weaponsRecord,
      clothings: this.clothingsRecord,
      consumables: this.consumablesRecord,
      miscObjects: this.miscObjectsRecord,
      ammo: this.ammoRecord
    }
  }

  get currentCarry() {
    const { ammo, clothings, weapons, consumables, miscObjects } = this
    const arr = [ammo, clothings, weapons, consumables, miscObjects]

    const totalCarry = arr.reduce(
      (acc, curr) => {
        const { weight, place } = curr.reduce(
          (acc2, { data, isEquiped, amount }: Carriable) => {
            const placeToAdd = isEquiped ? 0 : data.place
            return {
              weight: acc2.weight + data.weight * (amount || 1),
              place: acc2.place + placeToAdd * (amount || 1)
            }
          },
          { weight: 0, place: 0 }
        )
        return { weight: acc.weight + weight, place: acc.place + place }
      },
      { weight: 0, place: 0 }
    )
    const currWeight = Math.round(totalCarry.weight * 10) / 10
    const currPlace = Math.round(totalCarry.place * 10) / 10
    return { currWeight, currPlace }
  }
}
