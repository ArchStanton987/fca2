import { getModAttribute } from "lib/common/utils/char-calc"
import ammoMap from "lib/objects/ammo/ammo"
import { Ammo, AmmoType } from "lib/objects/ammo/ammo.types"
import clothingsMap from "lib/objects/clothings/clothings"
import { Clothing } from "lib/objects/clothings/clothings.types"
import consumablesMap from "lib/objects/consumables/consumables"
import { Consumable, ConsumableId } from "lib/objects/consumables/consumables.types"
import miscObjectsMap from "lib/objects/misc-objects/misc-objects"
import { MiscObject } from "lib/objects/misc-objects/misc-objects-types"
import { DbEquipedObjects, DbInventory } from "lib/objects/objects.types"
import weaponsMap from "lib/objects/weapons/weapons"
import { Weapon } from "lib/objects/weapons/weapons.types"
import { computed, makeObservable, observable } from "mobx"

import { DbAbilities } from "./abilities/abilities.types"
import { KnowledgeId } from "./abilities/knowledges/knowledge-types"
import { SkillsValues } from "./abilities/skills/skills.types"
import { Symptom } from "./effects/symptoms.type"

type CharData = {
  dbAbilities: DbAbilities
  innateSymptoms: Symptom[]
  currSkills: SkillsValues
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

  constructor(dbInventory: DbInventory, charData: CharData) {
    this.dbInventory = dbInventory
    this.charData = charData
    makeObservable(this, {
      dbInventory: observable,
      charData: observable,
      //
      weapons: computed,
      clothings: computed,
      consumables: computed,
      miscObjects: computed,
      ammo: computed,
      //
      inventory: computed,

      currentCarry: computed
    })
  }

  get weapons(): Weapon[] {
    return Object.entries(this.dbInventory.weapons || []).map(([dbKey, { id }]) => {
      const weaponSkill = weaponsMap[id].skill
      const weaponKnowledges = weaponsMap[id].knowledges
      const { ammoType } = weaponsMap[id]
      const ammo = ammoType ? this.dbInventory.ammo?.[ammoType] || 0 : 0
      const { innateSymptoms, currSkills, dbAbilities, dbEquipedObjects } = this.charData
      const { knowledges, traits } = dbAbilities
      const knowledgesBonus = weaponKnowledges.reduce(
        (acc, curr: KnowledgeId) =>
          acc + (knowledges[curr] ?? 0) + getModAttribute(innateSymptoms, curr),
        0
      )
      const skill = currSkills[weaponSkill] + knowledgesBonus
      const hasMrFast = traits?.includes("mrFast")
      let { basicApCost } = weaponsMap[id]
      basicApCost = basicApCost !== null && hasMrFast ? basicApCost - 1 : basicApCost
      const isEquiped = dbEquipedObjects?.weapons?.[dbKey] !== undefined
      const data = { ...weaponsMap[id], basicApCost }
      return { data, dbKey, id, skill, basicApCost, isEquiped, ammo }
    })
  }

  get clothings(): Clothing[] {
    return Object.entries(this.dbInventory.clothings || []).map(([dbKey, { id }]) => {
      const isEquiped = this.charData.dbEquipedObjects?.clothings?.[dbKey] !== undefined
      return { data: clothingsMap[id], dbKey, id, isEquiped }
    })
  }

  get consumables(): Consumable[] {
    return Object.entries(this.dbInventory.consumables || []).map(([dbKey, value]) => ({
      data: consumablesMap[value.id as ConsumableId],
      dbKey,
      id: value.id,
      remainingUse: value.remainingUse
    }))
  }

  get miscObjects(): MiscObject[] {
    return Object.entries(this.dbInventory.objects || {}).map(([dbKey, { id }]) => ({
      data: miscObjectsMap[id],
      dbKey,
      id
    }))
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
      objects: this.miscObjectsRecord,
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
