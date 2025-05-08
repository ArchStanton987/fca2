import { useState } from "react"
import { TouchableOpacity } from "react-native"

import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons"
import Slider from "@react-native-community/slider"
import {
  getCurrentActionId,
  getCurrentRoundId,
  getPlayingOrder
} from "lib/combat/utils/combat-utils"

import DrawerPage from "components/DrawerPage"
import Row from "components/Row"
import Section from "components/Section"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import { useCombat } from "providers/CombatProvider"
import { useGetUseCases } from "providers/UseCasesProvider"
import { difficultyArray } from "screens/CombatScreen/slides/ActionTypeSlide/info/DifficultyInfo"
import GoBackButton from "screens/CombatScreen/slides/GoBackButton"
import NextButton from "screens/CombatScreen/slides/NextButton"
import colors from "styles/colors"
import layout from "styles/layout"

export default function GMActionsScreen() {
  const useCases = useGetUseCases()
  const { combat, players, npcs } = useCombat()

  const [hasRoll, setHasRoll] = useState(false)
  const [difficulty, setDifficulty] = useState(0)

  const submit = () => {
    if (!combat) return
    const roll = hasRoll ? { difficultyModifier: difficulty } : null
    useCases.combat.updateAction({ combat, payload: { roll } })
  }

  const resetDifficulty = async () => {
    if (!combat) return
    setDifficulty(0)
    const roundId = getCurrentRoundId(combat)
    const actionId = getCurrentActionId(combat)
    const prev = { ...combat.rounds?.[roundId]?.[actionId] }
    delete prev.roll
    // TODO: FIX, not working
    const res = await useCases.combat.updateAction({ combat, payload: prev })
    console.log("res", res)
  }

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
  const actionId = getCurrentActionId(combat)
  const currActionRoll = combat?.rounds?.[roundId]?.[actionId]?.roll
  const isAwaitingDifficulty = currActionRoll === undefined

  if (!isAwaitingDifficulty)
    return (
      <DrawerPage>
        <Section style={{ flex: 1 }} contentContainerStyle={{ flex: 1 }}>
          <Txt>Rien à faire pour le moment</Txt>
          <Spacer y={50} />
          <TouchableOpacity onPress={resetDifficulty}>
            <Txt>RESET DIFF</Txt>
          </TouchableOpacity>
        </Section>
      </DrawerPage>
    )

  const difficultyLvl = difficultyArray.find(e => difficulty <= e.threshold)

  return (
    <DrawerPage style={{ flexDirection: "column" }}>
      <Section>
        <Row style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
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
          contentContainerStyle={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          title="reset difficulty"
        >
          <GoBackButton onPress={resetDifficulty} size={45} />
        </Section>
        <Spacer x={layout.globalPadding} />
        <Section
          style={{ flex: 1 }}
          contentContainerStyle={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
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

        <Section
          contentContainerStyle={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          title="valider"
        >
          <NextButton onPress={submit} size={45} />
        </Section>
      </Row>
    </DrawerPage>
  )
}
