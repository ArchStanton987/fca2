import { useMemo } from "react"

import dbKeys from "db/db-keys"
import Character, { DbChar } from "lib/character/Character"
import Squad from "lib/character/Squad"
import { DbAbilities } from "lib/character/abilities/abilities.types"
import { DbEffects } from "lib/character/effects/effects.types"
import { DbStatus } from "lib/character/status/status.types"
import Inventory from "lib/objects/Inventory"
import { DbEquipedObjects, DbInventory } from "lib/objects/data/objects.types"
import { DbSquad } from "lib/squad/squad-types"

import { CharacterContext } from "contexts/CharacterContext"
import { InventoryContext } from "contexts/InventoryContext"
import { SquadContext } from "contexts/SquadContext"
import useDbSubscribe from "hooks/db/useDbSubscribe"
import LoadingScreen from "screens/LoadingScreen"

type DbCollection<T> = T | undefined | null
type DbRecord<T> = T | undefined

export default function DataProvider({
  squadId,
  charId,
  children
}: {
  squadId: string
  charId: string
  children: React.ReactNode
}) {
  const dbSquad: DbRecord<DbSquad> = useDbSubscribe(dbKeys.squad(squadId).index)
  const squad = useMemo(() => {
    if (!dbSquad) return null
    return new Squad(dbSquad)
  }, [dbSquad])

  const dbCharUrl = dbKeys.char(charId)
  // use separate subscriptions to avoid unnecessary bandwidth usage
  const abilities: DbRecord<DbAbilities> = useDbSubscribe(dbCharUrl.abilities)
  const effects: DbCollection<DbEffects> = useDbSubscribe(dbCharUrl.effects)
  const equipedObj: DbCollection<DbEquipedObjects> = useDbSubscribe(dbCharUrl.equipedObjects.index)
  const inventory: DbCollection<DbInventory> = useDbSubscribe(dbCharUrl.inventory.index)
  const status: DbRecord<DbStatus> = useDbSubscribe(dbCharUrl.status)

  const character = useMemo(() => {
    const dbCharData = { abilities, effects, equipedObj, inventory, status }
    if (Object.values(dbCharData).some(data => data === undefined)) return null
    if (!dbSquad) return null
    return new Character(dbCharData as DbChar, new Date(dbSquad.datetime * 1000), charId)
  }, [dbSquad, charId, abilities, effects, equipedObj, inventory, status])

  const charInventory = useMemo(() => {
    if (!character) return null
    const { dbAbilities, innateSymptoms, currSkills, dbEquipedObjects } = character
    const charData = { dbAbilities, innateSymptoms, currSkills, dbEquipedObjects }
    return new Inventory(character?.dbInventory, charData)
  }, [character])

  if (!character || !charInventory || !squad) return <LoadingScreen />

  return (
    <SquadContext.Provider value={squad}>
      <CharacterContext.Provider value={character}>
        <InventoryContext.Provider value={charInventory}>{children}</InventoryContext.Provider>
      </CharacterContext.Provider>
    </SquadContext.Provider>
  )
}
