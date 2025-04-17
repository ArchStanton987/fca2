import { useMemo, useState } from "react"

import { Stack, useLocalSearchParams } from "expo-router"

import { NativeStackNavigationOptions } from "@react-navigation/native-stack"
import Character, { DbChar } from "lib/character/Character"
import Inventory from "lib/objects/Inventory"
import Toast from "react-native-toast-message"

import { DrawerParams } from "components/Drawer/Drawer.params"
import { CharacterContext } from "contexts/CharacterContext"
import { InventoryContext } from "contexts/InventoryContext"
import { useSquad } from "contexts/SquadContext"
import useCreatedElements from "hooks/context/useCreatedElements"
import useRtdbSub from "hooks/db/useRtdbSub"
import { ActionProvider } from "providers/ActionProvider"
import CombatProvider from "providers/CombatProvider"
import UpdatesProvider from "providers/UpdatesProvider"
import { useGetUseCases } from "providers/UseCasesProvider"
import LoadingScreen from "screens/LoadingScreen"
import { SearchParams } from "screens/ScreenParams"
import colors from "styles/colors"
import { getDDMMYYYY, getHHMM } from "utils/date"

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

  const useCases = useGetUseCases()

  const squad = useSquad()

  const [currDatetime, setCurrDatetime] = useState(squad.date.toJSON())

  // use separate subscriptions to avoid unnecessary bandwidth usage
  const abilities = useRtdbSub(useCases.abilities.getAbilities(charId))
  const effects = useRtdbSub(useCases.effects.getAll(charId))
  const equipedObj = useRtdbSub(useCases.equipedObjects.getAll(charId))
  const inventory = useRtdbSub(useCases.inventory.getAll(charId))
  const status = useRtdbSub(useCases.status.get(charId))

  const newElements = useCreatedElements()

  const character = useMemo(() => {
    const dbCharData = { abilities, effects, equipedObj, status }
    if (Object.values(dbCharData).some(data => data === undefined)) return null
    if (!squad) return null
    return new Character(dbCharData as DbChar, squad, charId, newElements)
  }, [squad, charId, abilities, effects, equipedObj, status, newElements])

  const charInventory = useMemo(() => {
    if (!character || !inventory) return null
    const { dbAbilities, innateSymptoms, skills, dbEquipedObjects, special } = character
    const charData = {
      dbAbilities,
      innateSymptoms,
      currSkills: skills.curr,
      dbEquipedObjects,
      currSpecial: special.curr
    }
    return new Inventory(inventory, charData, newElements)
  }, [character, inventory, newElements])

  if (!character || !charInventory || !squad) return <LoadingScreen />

  if (squad.date.toJSON() !== currDatetime) {
    setCurrDatetime(squad.date.toJSON())
    const newDate = getDDMMYYYY(squad.date)
    const newHour = getHHMM(squad.date)
    Toast.show({
      type: "custom",
      text1: `Le temps passe ! Nous sommes le ${newDate}, il est ${newHour}.`,
      autoHide: false
    })
  }

  return (
    <CharacterContext.Provider value={character}>
      <InventoryContext.Provider value={charInventory}>
        <UpdatesProvider>
          <CombatProvider>
            <ActionProvider>
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
                <Stack.Screen name="(modal)/update-health" options={modalOptions} />
                <Stack.Screen name="(modal)/update-skills" options={modalOptions} />
                <Stack.Screen name="(modal)/update-skills-confirmation" options={modalOptions} />
                <Stack.Screen name="(modal)/update-knowledges" options={modalOptions} />
              </Stack>
            </ActionProvider>
          </CombatProvider>
        </UpdatesProvider>
      </InventoryContext.Provider>
    </CharacterContext.Provider>
  )
}
