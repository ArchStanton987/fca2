import { StyleSheet, TouchableOpacity } from "react-native"

import { router, useLocalSearchParams } from "expo-router"

import { useCombatStatuses } from "lib/character/combat-status/combat-status-provider"
import Combat from "lib/combat/Combat"
import { useCombat, useContenders } from "lib/combat/use-cases/sub-combats"
import Toast from "react-native-toast-message"

import DrawerPage from "components/DrawerPage"
import Section from "components/Section"
import ScrollSection from "components/Section/ScrollSection"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import { useGetUseCases } from "providers/UseCasesProvider"
import colors from "styles/colors"
import layout from "styles/layout"
import { getDDMMYYYY, getHHMM } from "utils/date"

const styles = StyleSheet.create({
  actionButton: {
    padding: 8,
    borderWidth: 2,
    borderColor: colors.secColor,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center"
  }
})

const getIsValidCombatId = (combatId: string) =>
  combatId !== undefined && combatId !== "" && combatId !== "index"

function NoCombatSelected() {
  return (
    <Section
      style={{ flex: 1 }}
      contentContainerStyle={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <Txt>Aucun combat sélectionné</Txt>
    </Section>
  )
}

function Screen() {
  const { combatId, squadId } = useLocalSearchParams<{ combatId: string; squadId: string }>()
  const useCases = useGetUseCases()

  const { data: contendersIds = [] } = useContenders(combatId)
  const combatStatuses = useCombatStatuses(contendersIds)
  const isFightActive = Object.values(combatStatuses).some(c => c.combatId === combatId)
  const { data: combat } = useCombat(combatId)

  const deleteCombat = async () => {
    try {
      await useCases.combat.delete({ gameId: squadId, combatId })
      Toast.show({ type: "custom", text1: "Le combat a été supprimé" })
      router.setParams({ combatId: "" })
    } catch (error) {
      Toast.show({ type: "error", text1: "Erreur lors de la suppression du combat" })
    }
  }

  const adminEndFight = async () => {
    try {
      await useCases.combat.adminEndFight({ combatId })
      Toast.show({ type: "custom", text1: "Le combat a été clôturé" })
    } catch (error) {
      Toast.show({ type: "error", text1: "Erreur lors de la clôture du combat" })
    }
  }

  const startFight = async () => {
    if (!contendersIds) throw new Error("no contenders")
    try {
      await useCases.combat.startFight({ combatId, contenders: combat.contendersIds })
      Toast.show({ type: "custom", text1: "Le combat a été démarré" })
    } catch (error) {
      Toast.show({ type: "error", text1: "Erreur lors du démarrage du combat" })
    }
  }

  if (!getIsValidCombatId(combatId) || !(combat instanceof Combat)) return <NoCombatSelected />

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
        <Spacer y={20} />
        {isFightActive ? (
          <TouchableOpacity style={styles.actionButton} onPress={adminEndFight}>
            <Txt>CLOTURER</Txt>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.actionButton} onPress={startFight}>
            <Txt>DÉMARRER</Txt>
          </TouchableOpacity>
        )}

        <Spacer y={40} />

        <TouchableOpacity style={styles.actionButton} onPress={deleteCombat}>
          <Txt>SUPPRIMER</Txt>
        </TouchableOpacity>
      </ScrollSection>
    </DrawerPage>
  )
}

export default function CombatAdminScreen() {
  const { combatId } = useLocalSearchParams<{ combatId: string }>()
  if (!getIsValidCombatId(combatId)) return <NoCombatSelected />
  return <Screen />
}
