import dbKeys from "db/db-keys"

import useDbSubscribe from "hooks/db/useDbSubscribe"

type DbStatus = {
  background: string
  caps: number
  exp: number
  groinHp: number
  headHp: number
  leftArmHp: number
  leftTorsoHp: number
  rightTorsoHp: number
  leftLegHp: number
  level: number
  poison: number
  rads: number
  rightArmHp: number
  rightLegHp: number
}

export default function useGetStatus(charId: string) {
  const dbPath = dbKeys.char(charId).status

  return useDbSubscribe<DbStatus, DbStatus>(dbPath)
}
