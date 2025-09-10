import { ReactNode, useMemo, useState } from "react"
import { Platform } from "react-native"

import { Stack, useLocalSearchParams } from "expo-router"

import { NativeStackNavigationOptions } from "@react-navigation/native-stack"
import Character from "lib/character/Character"
import { useCurrCharStore, useSetCurrCharId } from "lib/character/character-store"
import NonHuman from "lib/npc/NonHuman"
import Inventory from "lib/objects/Inventory"
import Toast from "react-native-toast-message"

import { CharacterContext } from "contexts/CharacterContext"
import { InventoryContext } from "contexts/InventoryContext"
import { useSquad } from "contexts/SquadContext"
import useCreatedElements from "hooks/context/useCreatedElements"
import useRtdbSub from "hooks/db/useRtdbSub"
import { ActionProvider } from "providers/ActionProvider"
import { CombatStatusProvider } from "providers/CombatStatusProvider"
import { ReactionProvider } from "providers/ReactionProvider"
import UpdatesProvider from "providers/UpdatesProvider"
import { useGetUseCases } from "providers/UseCasesProvider"
import LoadingScreen from "screens/LoadingScreen"
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

function CharProvider({ children, charId }: { children: ReactNode; charId: string }) {
  const useCases = useGetUseCases()

  const squad = useSquad()
  const subParams = { id: charId }

  const [currDatetime, setCurrDatetime] = useState(squad.date.toJSON())

  // use separate subscriptions to avoid unnecessary bandwidth usage
  const abilities = useRtdbSub(useCases.character.subChild({ ...subParams, childKey: "abilities" }))
  const effects = useRtdbSub(useCases.character.subChild({ ...subParams, childKey: "effects" }))
  const equipedObj = useRtdbSub(
    useCases.character.subChild({ ...subParams, childKey: "equipedObj" })
  )
  const inventory = useRtdbSub(useCases.character.subChild({ ...subParams, childKey: "inventory" }))
  const status = useRtdbSub(useCases.character.subChild({ ...subParams, childKey: "status" }))
  const meta = useRtdbSub(useCases.character.subChild({ ...subParams, childKey: "meta" }))

  const newElements = useCreatedElements()

  const character = useMemo(() => {
    if (!status || !meta || !squad) return null
    if (meta.speciesId !== "human") return new NonHuman(charId, { status, meta }, squad)
    if (!abilities) return null
    const dbCharData = { abilities, effects, equipedObj, status, meta }
    return new Character(charId, dbCharData, squad, newElements)
  }, [charId, squad, abilities, effects, equipedObj, status, meta, newElements])

  const charInventory = useMemo(() => {
    if (!character) return null
    return new Inventory(inventory ?? { caps: 0 }, character, newElements)
  }, [character, inventory, newElements])

  if (!character || !squad) return <LoadingScreen />

  if (squad.date.toJSON() !== currDatetime) {
    setCurrDatetime(squad.date.toJSON())
    const newDate = getDDMMYYYY(squad.date)
    const newHour = getHHMM(squad.date)
    Toast.show({
      type: "custom",
      text1: `Le temps passe ! Nous sommes le ${newDate}, il est ${newHour}.`,
      autoHide: Platform.OS === "web"
    })
  }

  return (
    <CharacterContext.Provider value={character}>
      <InventoryContext.Provider value={charInventory}>{children}</InventoryContext.Provider>
    </CharacterContext.Provider>
  )
}

export default function CharStack() {
  const { charId } = useLocalSearchParams<{ charId: string }>()
  const currCharId = useCurrCharStore(state => state.charId)
  const setChar = useSetCurrCharId()

  if (charId && currCharId === null) {
    setChar(charId)
  }

  if (!currCharId) return <LoadingScreen />
  return (
    <CharProvider charId={currCharId}>
      <CombatStatusProvider charId={currCharId}>
        <UpdatesProvider>
          <ActionProvider>
            <ReactionProvider>
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
            </ReactionProvider>
          </ActionProvider>
        </UpdatesProvider>
      </CombatStatusProvider>
    </CharProvider>
  )
}
