import { useMemo } from "react"
import { TouchableOpacity } from "react-native"

import { router, useLocalSearchParams } from "expo-router"

import { usePlayables } from "lib/character/playables-provider"
import { useSubCombatInfo } from "lib/combat/use-cases/sub-combat"
import Toast from "react-native-toast-message"

import DrawerPage from "components/DrawerPage"
import Section from "components/Section"
import ScrollSection from "components/Section/ScrollSection"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import { useGetUseCases } from "providers/UseCasesProvider"
import LoadingScreen from "screens/LoadingScreen"
import layout from "styles/layout"
import { getDDMMYYYY, getHHMM } from "utils/date"

export default function AdminCombatScreen() {
  const useCases = useGetUseCases()
  const { combatId, squadId } = useLocalSearchParams<{ combatId: string; squadId: string }>()

  const combatInfoReq = useSubCombatInfo(combatId)
  const contendersIds = useMemo(
    () => Object.keys(combatInfoReq.data?.contenders ?? []),
    [combatInfoReq.data?.contenders]
  )

  const playables = usePlayables()
  const contenders = Object.fromEntries(contendersIds.map(id => [id, playables[id]]))

  const isPending = [combatInfoReq].some(r => r.isPending)
  if (!combatId) {
    return (
      <DrawerPage>
        <Section style={{ flex: 1 }} title="informations">
          <Txt>Aucun combat sélectionné</Txt>
        </Section>
      </DrawerPage>
    )
  }
  if (isPending || !combatInfoReq.data) return <LoadingScreen />
  if (!combatInfoReq.data) return <LoadingScreen />

  const isFightActive = Object.values(contenders).some(c => c.combatStatus.combatId === combatId)

  const deleteCombat = async () => {
    try {
      await useCases.combat.delete({ gameId: squadId, combatId, contenders })
      Toast.show({ type: "custom", text1: "Le combat a été supprimé" })
      router.setParams({ combatId: "" })
    } catch (error) {
      Toast.show({ type: "error", text1: "Erreur lors de la suppression du combat" })
    }
  }

  const adminEndFight = async () => {
    try {
      await useCases.combat.adminEndFight({ combatId, contenders })
      Toast.show({ type: "custom", text1: "Le combat a été clôturé" })
    } catch (error) {
      Toast.show({ type: "error", text1: "Erreur lors de la clôture du combat" })
    }
  }

  const startFight = async () => {
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
