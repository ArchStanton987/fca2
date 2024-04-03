import { useMemo } from "react"

import { Slot, useLocalSearchParams } from "expo-router"

import dbKeys from "db/db-keys"
import Squad from "lib/character/Squad"
import { DbSquad } from "lib/squad/squad-types"

import { DrawerParams } from "components/Drawer/Drawer.params"
import { SquadContext } from "contexts/SquadContext"
import useDbSubscribe from "hooks/db/useDbSubscribe"
import LoadingScreen from "screens/LoadingScreen"
import { SearchParams } from "screens/ScreenParams"

// TODO: create a type
type DbRecord<T> = T | undefined

export default function SquadLayout() {
  const { squadId } = useLocalSearchParams() as SearchParams<DrawerParams>
  const dbSquad: DbRecord<DbSquad> = useDbSubscribe(dbKeys.squad(squadId).index)

  const squad = useMemo(() => {
    if (!dbSquad) return null
    return new Squad(dbSquad, squadId)
  }, [dbSquad, squadId])

  if (!squad) return <LoadingScreen />

  return (
    <SquadContext.Provider value={squad}>
      <Slot />
    </SquadContext.Provider>
  )
}
