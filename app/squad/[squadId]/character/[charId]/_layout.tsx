import { Stack, useLocalSearchParams } from "expo-router"

import { NativeStackNavigationOptions } from "@react-navigation/native-stack"
import CharacterProvider from "lib/character/character-provider"
import { useCurrCharStore, useSetCurrCharId } from "lib/character/character-store"
import { InventoryProvider } from "lib/inventory/inventory-provider"

import { CombatStatusProvider } from "providers/CombatStatusProvider"
import { ReactionProvider } from "providers/ReactionProvider"
import UpdatesProvider from "providers/UpdatesProvider"
import LoadingScreen from "screens/LoadingScreen"
import colors from "styles/colors"

const modalOptions: NativeStackNavigationOptions = {
  presentation: "modal",
  animation: "slide_from_bottom",
  contentStyle: {
    backgroundColor: colors.primColor,
    paddingBottom: 5
  }
}

// function CharProvider({ children, charId }: { children: ReactNode; charId: string }) {
//   const useCases = useGetUseCases()

//   const squad = useSquad()
//   const subParams = { id: charId }

//   const [currDatetime, setCurrDatetime] = useState(squad.date.toJSON())

//   // use separate subscriptions to avoid unnecessary bandwidth usage
//   const abilities = useRtdbSub(useCases.character.subChild({ ...subParams, childKey: "abilities" }))
//   const effects = useRtdbSub(useCases.character.subChild({ ...subParams, childKey: "effects" }))
//   const equipedObj = useRtdbSub(
//     useCases.character.subChild({ ...subParams, childKey: "equipedObj" })
//   )
//   const status = useRtdbSub(useCases.character.subChild({ ...subParams, childKey: "status" }))
//   const meta = useRtdbSub(useCases.character.subChild({ ...subParams, childKey: "meta" }))

//   const newElements = useCreatedElements()

//   const character = useMemo(() => {
//     if (!status || !meta || !squad) return null
//     if (meta.speciesId !== "human") return new NonHuman(charId, { status, meta }, squad)
//     if (!abilities) return null
//     const dbCharData = { abilities, effects, equipedObj, status, meta }
//     return new Character(charId, dbCharData, squad, newElements)
//   }, [charId, squad, abilities, effects, equipedObj, status, meta, newElements])

//   if (!character || !squad) return <LoadingScreen />

//   if (squad.date.toJSON() !== currDatetime) {
//     setCurrDatetime(squad.date.toJSON())
//     const newDate = getDDMMYYYY(squad.date)
//     const newHour = getHHMM(squad.date)
//     Toast.show({
//       type: "custom",
//       text1: `Le temps passe ! Nous sommes le ${newDate}, il est ${newHour}.`,
//       autoHide: Platform.OS === "web"
//     })
//   }

//   return <CharacterContext.Provider value={character}>{children}</CharacterContext.Provider>
// }

export default function CharStack() {
  const { charId } = useLocalSearchParams<{ charId: string }>()
  const currCharId = useCurrCharStore(state => state.charId)
  const setChar = useSetCurrCharId()

  if (charId && currCharId === null) {
    setChar(charId)
  }

  if (!currCharId) return <LoadingScreen />
  return (
    <InventoryProvider charId={currCharId}>
      <CharacterProvider charId={currCharId}>
        <CombatStatusProvider charId={currCharId}>
          <UpdatesProvider>
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
          </UpdatesProvider>
        </CombatStatusProvider>
      </CharacterProvider>
    </InventoryProvider>
  )
}
