import { Squad } from "models/squad/squad-types"

const dbKeys = {
  squads: "/squads",
  squad: {
    id: (squadId: Squad["id"]) => `/squads/${squadId}`,
    members: (squadId: Squad["id"]) => `/squads/${squadId}/members`
  }
}

export default dbKeys
