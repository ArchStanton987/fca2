import { TouchableOpacity } from "react-native"

import { router, useLocalSearchParams } from "expo-router"

import { useSetCurrCharId } from "lib/character/character-store"
import { useCharCombatStatus } from "lib/character/combat-status/use-cases/sub-combat-status"
import { useSquad } from "lib/squad/use-cases/sub-squad"

import DrawerPage from "components/DrawerPage"
import Section from "components/Section"
import ScrollSection from "components/Section/ScrollSection"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import { useGetUseCases } from "providers/UseCasesProvider"
import layout from "styles/layout"

export default function EnemyScreen() {
  const useCases = useGetUseCases()
  const { npcId, squadId } = useLocalSearchParams<{ npcId: string; squadId: string }>()

  const { data: squad } = useSquad(squadId)
  const { npcs } = useAdmin()
  const currNpc = npcs[npcId]
  const npcCombatStatusReq = useCharCombatStatus(npcId)

  const setChar = useSetCurrCharId()

  const play = () => {
    setChar(npcId)
    router.push({
      pathname: "/squad/[squadId]/character/[charId]/main/recap",
      params: { charId: npcId, squadId }
    })
  }

  const deleteNpc = () => {
    if (!npcCombatStatusReq.data) return
    const npcCombatStatus = npcCombatStatusReq.data
    useCases.npc.delete({ squad, npcId, npcCombatStatus })
  }

  if (!npcs[npcId] || !npcCombatStatusReq.data) {
    return (
      <DrawerPage>
        <Section style={{ flex: 1 }} title="informations">
          <Txt>Aucun PNJ sélectionné</Txt>
        </Section>
      </DrawerPage>
    )
  }

  const isFighting = !!npcCombatStatusReq?.data?.combatId
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
