import { Squad } from "lib/squad/squad-types"

const dbKeys = {
  squads: "/squads",
  squad: (squadId: Squad["id"]) => ({
    index: `/squads/${squadId}`,
    members: `/squads/${squadId}/members`
  }),
  char: (charId: string) => ({
    index: `/characters/${charId}`,
    abilities: `/characters/${charId}/abilities`,
    inventory: {
      index: `/characters/${charId}/inventory`,
      weapons: `/characters/${charId}/inventory/weapons`,
      clothings: `/characters/${charId}/inventory/clothings`,
      consumables: `/characters/${charId}/inventory/consumables`,
      objects: `/characters/${charId}/inventory/objects`
    },
    knowledges: `/characters/${charId}/abilities/knowledges`,
    baseSpecial: `/characters/${charId}/abilities/baseSPECIAL`,
    effects: `/characters/${charId}/effects`,
    equipedObjects: {
      index: `/characters/${charId}/equipedObj`,
      weapons: `/characters/${charId}/equipedObj/weapons`,
      clothings: `/characters/${charId}/equipedObj/clothings`
    },
    status: `/characters/${charId}/status`
  })
}

export default dbKeys
