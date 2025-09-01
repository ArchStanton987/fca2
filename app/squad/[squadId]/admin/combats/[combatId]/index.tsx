import { TouchableOpacity } from "react-native"

import { useLocalSearchParams } from "expo-router"

import Playable from "lib/character/Playable"
import { CombatStatus } from "lib/character/combat-status/combat-status.types"
import { useContendersCombatStatus } from "lib/character/combat-status/use-cases/sub-combat-status"
import Combat from "lib/combat/Combat"
import Toast from "react-native-toast-message"

import DrawerPage from "components/DrawerPage"
import Section from "components/Section"
import ScrollSection from "components/Section/ScrollSection"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import { useAdmin } from "contexts/AdminContext"
import useRtdbSub from "hooks/db/useRtdbSub"
import { useGetUseCases } from "providers/UseCasesProvider"
import layout from "styles/layout"
import { getDDMMYYYY, getHHMM } from "utils/date"

export default function AdminCombatScreen() {
  const useCases = useGetUseCases()
  const { combatId } = useLocalSearchParams<{ combatId: string }>()

  const { characters, npcs } = useAdmin()

  const dbCombat = useRtdbSub(useCases.combat.sub({ id: combatId ?? "Non existing" }))
  const combat = dbCombat ? new Combat({ ...dbCombat, id: combatId }) : null
  const contendersRecord = combat ? { ...combat.players, ...combat.npcs } : {}
  const contendersIds = Object.keys(contendersRecord)
  const contendersCombatStatus = useContendersCombatStatus(contendersIds)

  if (!combat || contendersCombatStatus.some(e => e.isLoading)) {
    return (
      <DrawerPage>
        <Section style={{ flex: 1 }} title="informations">
          <Txt>Aucun combat sélectionné</Txt>
        </Section>
      </DrawerPage>
    )
  }

  const allPlayable = { ...characters, ...npcs }
  const contendersStatus: Record<string, { combatStatus: CombatStatus; maxAp: number }> = {}
  const contenders: Record<string, { char: Playable; combatStatus: CombatStatus }> = {}
  const contendersPlayable: Record<string, Playable> = {}
  contendersIds.forEach((id, i) => {
    const playable = allPlayable[id]
    const combatStatus = contendersCombatStatus[i].data
    if (!playable || !combatStatus) throw new Error(`Playable with id ${id} not found`)
    contendersStatus[id] = { combatStatus, maxAp: playable.secAttr.curr.actionPoints }
    contenders[id] = { char: playable, combatStatus }
    contendersPlayable[id] = playable
  })

  const isFightActive = contendersCombatStatus.some(e => e.data?.combatId === combatId)

  const deleteCombat = async () => {
    try {
      await useCases.combat.delete({ combat, contenders })
      Toast.show({ type: "custom", text1: "Le combat a été supprimé" })
    } catch (error) {
      Toast.show({ type: "error", text1: "Erreur lors de la suppression du combat" })
    }
  }

  const adminEndFight = async () => {
    try {
      await useCases.combat.adminEndFight({ combatId, contenders: contendersStatus })
      Toast.show({ type: "custom", text1: "Le combat a été clôturé" })
    } catch (error) {
      Toast.show({ type: "error", text1: "Erreur lors de la clôture du combat" })
    }
  }

  const startFight = async () => {
    try {
      await useCases.combat.startFight({ combatId, contenders: contendersPlayable })
      Toast.show({ type: "custom", text1: "Le combat a été démarré" })
    } catch (error) {
      Toast.show({ type: "error", text1: "Erreur lors du démarrage du combat" })
    }
  }

  const { title, description, location, date } = combat
  const d = getDDMMYYYY(date)
  const h = getHHMM(date)

  return (
    <DrawerPage>
      <Section style={{ flex: 1 }} title="informations">
        <Txt>Nom : {title}</Txt>
        <Txt>Description : {description}</Txt>
        <Txt>
          Date : {d} à {h}{" "}
        </Txt>
        <Txt>Lieu : {location}</Txt>
      </Section>

      <Spacer x={layout.globalPadding} />

      <ScrollSection style={{ width: 160 }} title="actions">
        {isFightActive ? (
          <TouchableOpacity onPress={adminEndFight}>
            <Txt>CLOTURER</Txt>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={startFight}>
            <Txt>DÉMARRER</Txt>
          </TouchableOpacity>
        )}

        <Spacer y={layout.globalPadding} />

        <TouchableOpacity onPress={deleteCombat}>
          <Txt>SUPPRIMER</Txt>
        </TouchableOpacity>
      </ScrollSection>
    </DrawerPage>
  )
}
