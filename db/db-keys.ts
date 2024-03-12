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
    inventory: `/characters/${charId}/inventory`,
    knowledges: `/characters/${charId}/abilities/knowledges`,
    baseSpecial: `/characters/${charId}/abilities/baseSPECIAL`,
    effects: `/characters/${charId}/effects`,
    equipedObjects: `/characters/${charId}/equipedObj`,
    status: `/characters/${charId}/status`
  })
}

export default dbKeys
