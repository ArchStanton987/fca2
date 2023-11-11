import { Effects } from "./Effects"
import { Status } from "./Status"
import { Abilities } from "./abilities/Abilities"

export type Character = {
  abilities: Abilities
  effects: Effects
  equipedObj: {}
  inventory: {}
  status: Status
}
