// import { AmmoSet } from "./data/ammo/ammo.types"

// type Carriable = {
//   data: { weight: number; place: number }
//   isEquiped?: boolean
//   amount?: number
// }

// export default class Inventory {
//   ammo: Partial<AmmoSet>
//   caps: number
//   items: Record<string, Weapon | Clothing | Consumable | MiscObject>
//   itemsArray: (Weapon | Clothing | Consumable | MiscObject)[]
//   weapons: Weapon[]
//   clothings: Clothing[]
//   consumables: Consumable[]
//   miscObjects: MiscObject[]
//   allClothings: Record<ClothingId, ClothingData>
//   allConsumables: Record<ConsumableId, ConsumableData>
//   allMiscObjects: Record<MiscObjectId, MiscObjectData>

//   constructor(dbInventory: DbInventory, newElements: CreatedElements = defaultCreatedElements) {
//     const { newClothings, newConsumables, newMiscObjects } = newElements
//     this.allClothings = { ...clothingsMap, ...newClothings }
//     this.allConsumables = { ...consumablesMap, ...newConsumables }
//     this.allMiscObjects = { ...miscObjectsMap, ...newMiscObjects }

//     this.ammo = dbInventory.ammo ?? {}
//     this.caps = dbInventory.caps

//     // makeObservable(this, {
//     //   dbInventory: observable,
//     //   charData: observable,
//     //   //
//     //   weapons: computed,
//     //   clothings: computed,
//     //   consumables: computed,
//     //   miscObjects: computed,
//     //   ammo: computed,
//     //   caps: computed,
//     //   //
//     //   weaponsRecord: computed,
//     //   clothingsRecord: computed,
//     //   consumablesRecord: computed,
//     //   miscObjectsRecord: computed,
//     //   ammoRecord: computed,
//     //   //
//     //   inventory: computed,
//     //   //
//     //   allItems: computed,
//     //   //
//     //   groupedConsumables: computed,
//     //   groupedMiscObjects: computed,

//     //   currentCarry: computed
//     // })
//   }

//   get weapons() {
//     return this.itemsArray.filter(e => e.category === "weapon")
//   }

//   get clothings() {
//     return this.itemsArray.filter(e => e.category === "clothing")
//   }

//   get consumables() {
//     return this.itemsArray.filter(e => e.category === "consumable")
//   }

//   get miscObjects() {
//     return this.itemsArray.filter(e => e.category === "misc")
//   }

//   get groupedConsumables(): (Consumable & { count: number })[] {
//     return filterUnique(
//       "id",
//       this.consumables.map((consumable, _, currArr) => {
//         const count = currArr.filter(el => el.id === consumable.id).length
//         return { ...consumable, count }
//       })
//     )
//   }

//   getSymptoms() {
//     this.clothings.map(c => c.data.symptoms)
//   }

//   get groupedMiscObjects(): (MiscObject & { count: number })[] {
//     return filterUnique(
//       "id",
//       this.miscObjects.map((consumable, _, currArr) => {
//         const count = currArr.filter(el => el.id === consumable.id).length
//         return { ...consumable, count }
//       })
//     )
//   }

//   // get ammo(): Ammo[] {
//   //   return Object.entries(this.dbInventory.ammo || {})
//   //     .filter(([, amount]) => amount > 0)
//   //     .map(([id, amount]) => ({ data: ammoMap[id as AmmoType], id: id as AmmoType, amount }))
//   //     .sort((a, b) => b.amount - a.amount)
//   // }

//   // get caps(): number {
//   //   return this.dbInventory.caps || 0
//   // }

//   // get weaponsRecord() {
//   //   const weaponsRecord: Record<string, Weapon> = {}
//   //   this.weapons.forEach(record => {
//   //     weaponsRecord[record.dbKey] = record
//   //   })
//   //   return weaponsRecord
//   // }

//   // get clothingsRecord() {
//   //   const clothingsRecord: Record<string, Clothing> = {}
//   //   this.clothings.forEach(record => {
//   //     clothingsRecord[record.dbKey] = record
//   //   })
//   //   return clothingsRecord
//   // }

//   // get consumablesRecord() {
//   //   const consumablesRecord: Record<string, Consumable> = {}
//   //   this.consumables.forEach(record => {
//   //     consumablesRecord[record.dbKey] = record
//   //   })
//   //   return consumablesRecord
//   // }

//   // get miscObjectsRecord() {
//   //   const miscObjectsRecord: Record<string, MiscObject> = {}
//   //   this.miscObjects.forEach(record => {
//   //     miscObjectsRecord[record.dbKey] = record
//   //   })
//   //   return miscObjectsRecord
//   // }

//   // get ammoRecord() {
//   //   const ammoRecord = {} as Record<AmmoType, number>
//   //   this.ammo.forEach(record => {
//   //     ammoRecord[record.id] = record.amount
//   //   })
//   //   return ammoRecord
//   // }

//   // get inventory() {
//   //   return {
//   //     weapons: this.weaponsRecord,
//   //     clothings: this.clothingsRecord,
//   //     consumables: this.consumablesRecord,
//   //     miscObjects: this.miscObjectsRecord,
//   //     ammo: this.ammoRecord
//   //   }
//   // }

//   // get allItems() {
//   //   return {
//   //     ...this.weaponsRecord,
//   //     ...this.clothingsRecord,
//   //     ...this.consumablesRecord,
//   //     ...this.miscObjectsRecord
//   //   }
//   // }

//   get currentCarry() {
//     const { ammo, clothings, weapons, consumables, miscObjects } = this
//     const arr = [ammo, clothings, weapons, consumables, miscObjects]

//     const totalCarry = arr.reduce(
//       (acc, curr) => {
//         const { weight, place } = curr.reduce(
//           (acc2, { data, isEquiped, amount }: Carriable) => {
//             const placeToAdd = isEquiped ? 0 : data.place
//             return {
//               weight: acc2.weight + data.weight * (amount || 1),
//               place: acc2.place + placeToAdd * (amount || 1)
//             }
//           },
//           { weight: 0, place: 0 }
//         )
//         return { weight: acc.weight + weight, place: acc.place + place }
//       },
//       { weight: 0, place: 0 }
//     )
//     const currWeight = Math.round(totalCarry.weight * 10) / 10
//     const currPlace = Math.round(totalCarry.place * 10) / 10
//     return { currWeight, currPlace }
//   }
// }

// export default class Inventory {
//   ammo: Partial<AmmoSet>
//   caps: number
//   items: Record<string, Item>

//   constructor(payload: { ammo: Partial<AmmoSet>; caps: number; items: Record<string, Item> }) {
//     this.ammo = payload.ammo
//     this.caps = payload.caps
//     this.items = payload.items
//   }
// }
