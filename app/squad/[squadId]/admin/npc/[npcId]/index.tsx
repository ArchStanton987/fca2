import { TouchableOpacity } from "react-native"

import { router, useLocalSearchParams } from "expo-router"

import { useSetCurrCharId } from "lib/character/character-store"

import DrawerPage from "components/DrawerPage"
import Section from "components/Section"
import ScrollSection from "components/Section/ScrollSection"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import { useAdmin } from "contexts/AdminContext"
import { useSquad } from "contexts/SquadContext"
import { useGetUseCases } from "providers/UseCasesProvider"
import layout from "styles/layout"

export default function EnemyScreen() {
  const useCases = useGetUseCases()
  const { npcId } = useLocalSearchParams<{ npcId: string }>()

  const squad = useSquad()
  const { npcs } = useAdmin()

  const setChar = useSetCurrCharId()

  const play = () => {
    setChar(npcId)
    router.push({
      pathname: "/squad/[squadId]/character/[charId]/main/recap",
      params: { charId: npcId, squadId: squad.squadId }
    })
  }

  const deleteNpc = () => {
    useCases.npc.delete({ squad, playable: npcs[npcId] })
  }

  if (!npcs[npcId]) {
    return (
      <DrawerPage>
        <Section style={{ flex: 1 }} title="informations">
          <Txt>Aucun PNJ sélectionné</Txt>
        </Section>
      </DrawerPage>
    )
  }

  const currNpc = npcs[npcId]
  const isFighting = !!currNpc.status.currentCombatId
  const { firstname, description, templateId } = currNpc.meta

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
