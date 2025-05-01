import { useMemo } from "react"
import { View } from "react-native"

import { Tabs } from "expo-router"

import Character from "lib/character/Character"
import NonHuman from "lib/npc/NonHuman"

import Header from "components/Header/Header"
import { HeaderElementId } from "components/Header/Header.utils"
import TabBar from "components/TabBar/TabBar"
import { AdminContext } from "contexts/AdminContext"
import { useSquad } from "contexts/SquadContext"
import useCreatedElements from "hooks/context/useCreatedElements"
import useGetSquadCharacters from "hooks/db/useGetSquadCharacters"
import useRtdbSubs from "hooks/db/useRtdbSubs"
import { useGetUseCases } from "providers/UseCasesProvider"
import LoadingScreen from "screens/LoadingScreen"
import colors from "styles/colors"

const headerElementsIds: HeaderElementId[] = ["date", "time", "squadName", "home"]

function HeaderDatetime() {
  return <Header headerElementsIds={headerElementsIds} />
}

function TabBarComponent(props: any) {
  return <TabBar tabbarLabel="Admin" {...props} />
}

export default function AdminLayout() {
  const useCases = useGetUseCases()
  const createdElements = useCreatedElements()
  const squad = useSquad()
  const { members } = squad
  // TODO: fix useGetSquadCharacters loop when dependencies are registered, insure stable ref of params
  const squadMembersIds = useMemo(() => members.map(member => member.id), [members])
  const currSquad = useMemo(() => squad, [squad])
  const characters = useGetSquadCharacters(squadMembersIds || [], currSquad, createdElements)

  const npcSubs = useMemo(
    () => useCases.npc.subNpcs(squad.npc).map((s, i) => ({ ...s, id: squad.npc[i] })),
    [squad, useCases]
  )
  const npcDatas = useRtdbSubs(npcSubs)

  const npcs = useMemo(() => {
    if (!npcDatas) return {}
    const result: Record<string, NonHuman | Character> = {}
    Object.entries(npcDatas).forEach(([id, value]) => {
      if ("abilities" in value) {
        result[id] = new Character(id, value, squad, createdElements)
        return
      }
      result[id] = new NonHuman(id, value, squad)
    })
    return result
  }, [npcDatas, squad, createdElements])

  const context = useMemo(() => {
    if (!characters) return null
    return { characters, npcs }
  }, [characters, npcs])

  if (!context) return <LoadingScreen />

  return (
    <AdminContext.Provider value={context}>
      <View style={{ padding: 10, flex: 1 }}>
        <Tabs
          tabBar={TabBarComponent}
          screenOptions={{
            tabBarHideOnKeyboard: true,
            header: HeaderDatetime,
            headerStyle: { backgroundColor: colors.primColor, borderBottomWidth: 0 },
            sceneStyle: { backgroundColor: colors.primColor }
          }}
        >
          <Tabs.Screen name="datetime" options={{ title: "Horloge" }} />
          <Tabs.Screen name="combats" options={{ title: "Combats" }} />
          <Tabs.Screen name="npc" options={{ title: "PNJs" }} />
          <Tabs.Screen name="creation" options={{ title: "Creation" }} />
        </Tabs>
      </View>
    </AdminContext.Provider>
  )
}
