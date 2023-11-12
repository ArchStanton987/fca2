import { Squad } from "models/squad/squad-types"

const dbKeys = {
  squads: "/squads",
  squad: (squadId: Squad["id"]) => `/squads/${squadId}`,
  squadMembers: (squadId: Squad["id"]) => `/squads/${squadId}/members`
}

export default dbKeys
