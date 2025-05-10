import { useState } from "react"
import { StyleSheet, TouchableOpacity } from "react-native"

import { Redirect } from "expo-router"

import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons"
import Slider from "@react-native-community/slider"
import { ActionTypeId, withRollActionsTypes } from "lib/combat/const/actions"
import difficultyArray from "lib/combat/const/difficulty"
import { getActionId, getCurrentRoundId, getPlayingOrder } from "lib/combat/utils/combat-utils"

import DrawerPage from "components/DrawerPage"
import Row from "components/Row"
import Section from "components/Section"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import routes from "constants/routes"
import { useCharacter } from "contexts/CharacterContext"
import { useCombat } from "providers/CombatProvider"
import { useGetUseCases } from "providers/UseCasesProvider"
import DeleteButton from "screens/CombatScreen/slides/DeleteButton"
import NextButton from "screens/CombatScreen/slides/NextButton"
import colors from "styles/colors"
import layout from "styles/layout"

const styles = StyleSheet.create({
  centeredSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
})

export default function GMActionsScreen() {
  const useCases = useGetUseCases()
  const { meta, charId } = useCharacter()
  const { combat, players, npcs } = useCombat()

  const [hasRoll, setHasRoll] = useState(false)
  const [difficulty, setDifficulty] = useState(0)

  const submit = () => {
    if (!combat) return
    const roll = hasRoll ? { difficultyModifier: difficulty } : null
    useCases.combat.updateAction({ combat, payload: { roll } })
  }

  const resetDifficulty = () => {
    if (!combat) return
    setDifficulty(0)
    const roundId = getCurrentRoundId(combat)
    const actionId = getActionId(combat)
    const payload = { ...combat.rounds?.[roundId]?.[actionId] }
    delete payload.roll
    useCases.combat.setAction({ combat, payload })
  }

  if (!meta.isNpc)
    return (
      <Redirect
        href={{ pathname: routes.combat.index, params: { charId, squadId: meta.squadId } }}
      />
    )
  if (combat === null)
    return (
      <DrawerPage>
        <Txt>Impossible de récupérer le combat en cours</Txt>
      </DrawerPage>
    )

  const contenders = getPlayingOrder({ ...players, ...npcs })
  const defaultPlayingId =
    contenders.find(c => c.char.status.combatStatus === "active")?.char.charId ??
    contenders.find(c => c.char.status.combatStatus === "wait")?.char.charId
  const playingId = combat.currActorId || defaultPlayingId
  const currPlayer = contenders.find(c => c.char.charId === playingId)

  if (!currPlayer) return <Txt>Impossible de récupérer le joueur</Txt>

  const roundId = getCurrentRoundId(combat)
  const actionId = getActionId(combat)
  const action = combat?.rounds?.[roundId]?.[actionId]
  const actionHasDifficulty = withRollActionsTypes.includes(action?.actionType as ActionTypeId)
  const isDifficultySet = action?.roll?.difficultyModifier !== undefined

  if (!actionHasDifficulty)
    return (
      <DrawerPage>
        <Section style={{ flex: 1 }} contentContainerStyle={{ flex: 1 }}>
          <Txt>Rien à faire pour le moment</Txt>
          <Spacer y={50} />
        </Section>
      </DrawerPage>
    )

  const difficultyLvl = difficultyArray.find(e => difficulty <= e.threshold)

  return (
    <DrawerPage style={{ flexDirection: "column" }}>
      <Section>
        <Row style={styles.centeredSection}>
          <Txt
            style={{
              color: hasRoll ? difficultyLvl?.color ?? colors.secColor : colors.terColor,
              fontSize: 25
            }}
          >
            {difficulty} :{" "}
          </Txt>
          <Txt
            style={{
              color: hasRoll ? difficultyLvl?.color ?? colors.secColor : colors.terColor,
              fontSize: 25
            }}
          >
            {difficultyLvl?.label}
          </Txt>
        </Row>

        <Spacer y={20} />

        <Slider
          style={{ flex: 1 }}
          minimumValue={-99}
          disabled={!hasRoll}
          minimumTrackTintColor={hasRoll ? colors.quadColor : colors.terColor}
          maximumTrackTintColor={hasRoll ? colors.quadColor : colors.terColor}
          maximumValue={120}
          step={1}
          thumbTintColor={hasRoll ? colors.secColor : colors.terColor}
          value={difficulty}
          onValueChange={value => setDifficulty(value)}
        />

        <Spacer y={20} />
      </Section>

      <Spacer y={layout.globalPadding} />

      <Row style={{ flex: 1 }}>
        <Section
          style={{ width: 100 }}
          contentContainerStyle={styles.centeredSection}
          title="reset"
        >
          <DeleteButton onPress={resetDifficulty} size={45} disabled={!isDifficultySet} />
        </Section>

        <Spacer x={layout.globalPadding} />

        <Section title="action" style={{ width: 100 }}>
          <Txt>{currPlayer.char.meta.firstname}</Txt>
          <Txt>{action?.actionType}</Txt>
          <Txt>{action?.actionSubtype}</Txt>
        </Section>

        <Spacer x={layout.globalPadding} />
        <Section style={{ flex: 1 }} contentContainerStyle={styles.centeredSection}>
          <Row style={{ alignItems: "center" }}>
            <Txt>Doit effectuer un jet de dés ?</Txt>
            <Spacer x={10} />
            <TouchableOpacity onPress={() => setHasRoll(prev => !prev)}>
              <MaterialCommunityIcons
                name={hasRoll ? "check-decagram-outline" : "decagram-outline"}
                size={50}
                color={hasRoll ? colors.secColor : colors.terColor}
              />
            </TouchableOpacity>
          </Row>
        </Section>

        <Spacer x={layout.globalPadding} />

        <Section contentContainerStyle={styles.centeredSection} title="valider">
          <NextButton onPress={submit} size={45} disabled={isDifficultySet} />
        </Section>
      </Row>
    </DrawerPage>
  )
}
