import { TouchableOpacity } from "react-native"

import { useLocalSearchParams } from "expo-router"

import { useContendersCombatStatus } from "lib/character/combat-status/use-cases/sub-combat-status"
import { useSubCombatInfo } from "lib/combat/use-cases/sub-combat"
import Toast from "react-native-toast-message"

import DrawerPage from "components/DrawerPage"
import Section from "components/Section"
import ScrollSection from "components/Section/ScrollSection"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import { useAdmin } from "contexts/AdminContext"
import { CombatStatusesProvider } from "providers/CombatStatusesProvider"
import { useGetUseCases } from "providers/UseCasesProvider"
import LoadingScreen from "screens/LoadingScreen"
import layout from "styles/layout"
import { getDDMMYYYY, getHHMM } from "utils/date"

function AdminCombat() {
  const useCases = useGetUseCases()
  const { combatId } = useLocalSearchParams<{ combatId: string }>()

  const combatInfoReq = useSubCombatInfo(combatId)
  const contendersIds = Object.keys(combatInfoReq.data ?? [])
  const combatStatusesReq = useContendersCombatStatus(contendersIds)

  const { characters, npcs } = useAdmin()
  const allPlayable = { ...characters, ...npcs }

  const isPending = [combatInfoReq, combatStatusesReq].some(r => r.isPending)
  if (isPending) return <LoadingScreen />
  if (!combatStatusesReq.data || !combatInfoReq.data) {
    return (
      <DrawerPage>
        <Section style={{ flex: 1 }} title="informations">
          <Txt>Aucun combat sélectionné</Txt>
        </Section>
      </DrawerPage>
    )
  }

  const combatStatuses = combatStatusesReq.data
  const isFightActive = Object.values(combatStatuses).some(s => s.combatId === combatId)

  const deleteCombat = async () => {
    const contenders = Object.fromEntries(contendersIds.map(id => [id, allPlayable[id]]))
    try {
      await useCases.combat.delete({ combatId, contenders, combatStatuses })
      Toast.show({ type: "custom", text1: "Le combat a été supprimé" })
    } catch (error) {
      Toast.show({ type: "error", text1: "Erreur lors de la suppression du combat" })
    }
  }

  const adminEndFight = async () => {
    const contenders = Object.fromEntries(
      Object.keys(combatStatuses).map(id => [id, allPlayable[id]])
    )
    try {
      await useCases.combat.adminEndFight({ combatId, combatStatuses, contenders })
      Toast.show({ type: "custom", text1: "Le combat a été clôturé" })
    } catch (error) {
      Toast.show({ type: "error", text1: "Erreur lors de la clôture du combat" })
    }
  }

  const startFight = async () => {
    const contenders = Object.fromEntries(
      Object.keys(contendersIds).map(id => [id, allPlayable[id]])
    )
    try {
      await useCases.combat.startFight({ combatId, contenders })
      Toast.show({ type: "custom", text1: "Le combat a été démarré" })
    } catch (error) {
      Toast.show({ type: "error", text1: "Erreur lors du démarrage du combat" })
    }
  }

  const { title, description, location } = combatInfoReq.data
  const date = new Date(combatInfoReq.data.date)
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

export default function AdminCombatScreen() {
  return (
    <CombatStatusesProvider>
      <AdminCombat />
    </CombatStatusesProvider>
  )
}
