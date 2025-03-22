import { DbChar } from "lib/character/Character"

export type DbEnemy = {
  status: DbChar["status"]
  combats: DbChar["combats"]
}
