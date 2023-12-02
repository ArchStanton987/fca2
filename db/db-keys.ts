import { Character } from "models/character/character-types"
import { Squad } from "models/squad/squad-types"

const dbKeys = {
  squads: "/squads",
  squad: (squadId: Squad["id"]) => ({
    index: `/squads/${squadId}`,
    members: `/squads/${squadId}/members`
  }),
  char: (charId: Character["id"]) => ({
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
