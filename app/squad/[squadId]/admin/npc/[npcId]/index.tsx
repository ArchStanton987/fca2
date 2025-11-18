import { Suspense } from "react"
import { TouchableOpacity } from "react-native"

import { router, useLocalSearchParams } from "expo-router"

import { useSetCurrCharId } from "lib/character/character-store"
import { useCombatStatus } from "lib/character/combat-status/combat-status-provider"
import { useCharInfo } from "lib/character/info/info-provider"

import DrawerPage from "components/DrawerPage"
import Section from "components/Section"
import ScrollSection from "components/Section/ScrollSection"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import { useGetUseCases } from "providers/UseCasesProvider"
import LoadingScreen from "screens/LoadingScreen"
import layout from "styles/layout"

function Screen() {
  const useCases = useGetUseCases()
  const { npcId, squadId } = useLocalSearchParams<{ npcId: string; squadId: string }>()

  const setChar = useSetCurrCharId()

  const { data: combatStatus } = useCombatStatus(npcId)
  const { data: charInfo } = useCharInfo(npcId)

  const play = () => {
    setChar(npcId)
    router.push({
      pathname: "/squad/[squadId]/character/[charId]/main/recap",
      params: { charId: npcId, squadId }
    })
  }

  const deleteNpc = async () => {
    await useCases.npc.delete({ squadId, npcId })
    router.setParams({ npcId: "" })
  }

  const isFighting = !!combatStatus.combatId
  const { firstname, description, templateId } = charInfo

  if (!npcId)
    return (
      <Section
        style={{ flex: 1 }}
        contentContainerStyle={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Txt>Aucun personnage sélectionné</Txt>
      </Section>
    )

  return (
    <DrawerPage>
      <Section style={{ flex: 1 }} title="informations">
        <Txt>Nom : {firstname}</Txt>
        <Txt>Description : {description}</Txt>
        <Txt>Template : {templateId}</Txt>
      </Section>

      <Spacer x={layout.globalPadding} />

      <ScrollSection style={{ width: 160 }} title="actions">
        <TouchableOpacity onPress={play}>
          <Txt>INCARNER</Txt>
        </TouchableOpacity>

        <Spacer y={layout.globalPadding} />

        {!isFighting && (
          <TouchableOpacity onPress={deleteNpc}>
            <Txt>SUPPRIMER</Txt>
          </TouchableOpacity>
        )}
      </ScrollSection>
    </DrawerPage>
  )
}

export default function NpcScreen() {
  const { npcId } = useLocalSearchParams<{ npcId?: string }>()
  if (!npcId)
    return (
      <Section
        style={{ flex: 1 }}
        contentContainerStyle={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Txt>Aucun personnage sélectionné</Txt>
      </Section>
    )
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Screen />
    </Suspense>
  )
}
