import { useMemo } from "react"

import { Stack, useLocalSearchParams } from "expo-router"

import dbKeys from "db/db-keys"
import Character from "lib/character/Character"
import Inventory from "lib/character/Inventory"
import Squad from "lib/character/Squad"
import { DbAbilities } from "lib/character/abilities/abilities.types"
import { DbEffects } from "lib/character/effects/effects.types"
import { DbStatus } from "lib/character/status/status.types"
import { DbEquipedObjects, DbInventory } from "lib/objects/objects.types"
import { DbSquad } from "lib/squad/squad-types"

import { DrawerParams } from "components/Drawer/Drawer.params"
import { CharacterContext } from "contexts/CharacterContext"
import { InventoryContext } from "contexts/InventoryContext"
import { SquadContext } from "contexts/SquadContext"
import useDbSubscribe from "hooks/db/useDbSubscribe"
import LoadingScreen from "screens/LoadingScreen"
import { SearchParams } from "screens/ScreenParams"
import colors from "styles/colors"

const modalOptions: NativeStackNavigationOptions = {
  presentation: "modal",
  animation: "slide_from_bottom"
}

export default function CharLayout() {
  const { charId, squadId } = useLocalSearchParams() as SearchParams<DrawerParams>

  const dbSquad: DbSquad | null = useDbSubscribe(dbKeys.squad(squadId).index)
  const squad = useMemo(() => {
    if (!dbSquad) return null
    return new Squad(dbSquad)
  }, [dbSquad])

  const dbCharUrl = dbKeys.char(charId)
  // use separate subscriptions to avoid unnecessary bandwidth usage
  const abilities: DbAbilities | null = useDbSubscribe(dbCharUrl.abilities)
  const effects: DbEffects | null = useDbSubscribe(dbCharUrl.effects)
  const equipedObj: DbEquipedObjects | null = useDbSubscribe(dbCharUrl.equipedObjects.index)
  const inventory: DbInventory | null = useDbSubscribe(dbCharUrl.inventory.index)
  const status: DbStatus | null = useDbSubscribe(dbCharUrl.status)

  const character = useMemo(() => {
    if (!abilities || !effects || !equipedObj || !inventory || !status || !dbSquad) return null
    const dbChar = { abilities, effects, equipedObj, inventory, status }
    return new Character(dbChar, new Date(dbSquad.datetime * 1000), charId)
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
        <InventoryContext.Provider value={charInventory}>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: colors.primColor, padding: 10 }
            }}
          >
            <Stack.Screen name="(nav)" />
            <Stack.Screen name="(modal)/update-effects" options={modalOptions} />
            <Stack.Screen name="(modal)/confirmation" options={modalOptions} />
          </Stack>
        </InventoryContext.Provider>
      </CharacterContext.Provider>
    </SquadContext.Provider>
  )
}
