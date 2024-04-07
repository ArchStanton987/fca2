import { useMemo } from "react"

import { Stack, useLocalSearchParams } from "expo-router"

import { NativeStackNavigationOptions } from "@react-navigation/native-stack"
import dbKeys from "db/db-keys"
import Character, { DbChar } from "lib/character/Character"
import { DbAbilities } from "lib/character/abilities/abilities.types"
import { DbEffects } from "lib/character/effects/effects.types"
import { DbStatus } from "lib/character/status/status.types"
import Inventory from "lib/objects/Inventory"
import { DbEquipedObjects, DbInventory } from "lib/objects/data/objects.types"

import { DrawerParams } from "components/Drawer/Drawer.params"
import { CharacterContext } from "contexts/CharacterContext"
import { InventoryContext } from "contexts/InventoryContext"
import { useSquad } from "contexts/SquadContext"
import useDbSubscribe from "hooks/db/useDbSubscribe"
import UpdateObjectsProvider from "providers/UpdateObjectsProvider"
import LoadingScreen from "screens/LoadingScreen"
import { SearchParams } from "screens/ScreenParams"
import colors from "styles/colors"

type DbCollection<T> = T | undefined | null
type DbRecord<T> = T | undefined

const modalOptions: NativeStackNavigationOptions = {
  presentation: "modal",
  animation: "slide_from_bottom",
  contentStyle: {
    backgroundColor: colors.primColor,
    paddingBottom: 5
  }
}

export default function CharStack() {
  const { charId } = useLocalSearchParams() as SearchParams<DrawerParams>

  const squad = useSquad()

  const dbCharUrl = dbKeys.char(charId)
  // use separate subscriptions to avoid unnecessary bandwidth usage
  const abilities: DbRecord<DbAbilities> = useDbSubscribe(dbCharUrl.abilities)
  const effects: DbCollection<DbEffects> = useDbSubscribe(dbCharUrl.effects)
  const equipedObj: DbCollection<DbEquipedObjects> = useDbSubscribe(dbCharUrl.equipedObjects.index)
  const inventory: DbCollection<DbInventory> = useDbSubscribe(dbCharUrl.inventory.index)
  const status: DbRecord<DbStatus> = useDbSubscribe(dbCharUrl.status.index)

  const character = useMemo(() => {
    const dbCharData = { abilities, effects, equipedObj, inventory, status }
    if (Object.values(dbCharData).some(data => data === undefined)) return null
    if (!squad) return null
    return new Character(dbCharData as DbChar, squad.date, charId)
  }, [squad, charId, abilities, effects, equipedObj, inventory, status])

  const charInventory = useMemo(() => {
    if (!character) return null
    const { dbAbilities, innateSymptoms, currSkills, dbEquipedObjects } = character
    const charData = { dbAbilities, innateSymptoms, currSkills, dbEquipedObjects }
    return new Inventory(character?.dbInventory, charData)
  }, [character])

  if (!character || !charInventory || !squad) return <LoadingScreen />

  return (
    <CharacterContext.Provider value={character}>
      <InventoryContext.Provider value={charInventory}>
        <UpdateObjectsProvider>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: colors.primColor, padding: 10 }
            }}
          >
            <Stack.Screen name="(nav)" />
            <Stack.Screen name="(modal)/update-effects" options={modalOptions} />
            <Stack.Screen name="(modal)/update-effects-confirmation" options={modalOptions} />
            <Stack.Screen name="(modal)/update-objects" options={modalOptions} />
            <Stack.Screen name="(modal)/update-objects-confirmation" options={modalOptions} />
            <Stack.Screen name="(modal)/update-status" options={modalOptions} />
            <Stack.Screen name="(modal)/update-status-confirmation" options={modalOptions} />
          </Stack>
        </UpdateObjectsProvider>
      </InventoryContext.Provider>
    </CharacterContext.Provider>
  )
}
