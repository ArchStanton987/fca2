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
    baseSpecial: `/characters/${charId}/abilities/baseSPECIAL`
  })
}

export default dbKeys
