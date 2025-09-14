import { StyleSheet } from "react-native"

import CheckBox from "components/CheckBox/CheckBox"
import List from "components/List"
import Section from "components/Section"
import Spacer from "components/Spacer"
import { useCharacter } from "contexts/CharacterContext"
import { useCombatState } from "providers/CombatStateProvider"
import { useCombatStatus } from "providers/CombatStatusProvider"
import { useCombatStatuses } from "providers/CombatStatusesProvider"
import { useContenders } from "providers/ContendersProvider"
import { useGetUseCases } from "providers/UseCasesProvider"
import colors from "styles/colors"
import layout from "styles/layout"

const styles = StyleSheet.create({
  checkboxContainer: {
    justifyContent: "space-between",
    paddingHorizontal: 15
  }
})

type ApVisualizerProps = {
  apArr: { id: string; isChecked: boolean; isPreview: boolean }[]
  currAp: number
  maxAp: number
  handleSetAp: (val: number) => void
}

function ApVisualizerUi({ apArr, currAp, maxAp, handleSetAp }: ApVisualizerProps) {
  return (
    <Section title={`Points d'action : ${currAp} / ${maxAp}`}>
      <List
        data={apArr}
        horizontal
        style={styles.checkboxContainer}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <CheckBox
            color={item.isPreview ? colors.yellow : colors.secColor}
            size={30}
            isChecked={item.isChecked}
            onPress={() => handleSetAp(parseInt(item.id, 10))}
          />
        )}
      />
      <Spacer y={layout.globalPadding} />
    </Section>
  )
}

function CombatApVisualizer({ contenderId }: { contenderId?: string }) {
  const useCases = useGetUseCases()
  const { action } = useCombatState()
  const character = useCharacter()
  const playerId = contenderId ?? character.charId
  const globalCs = useCombatStatuses(playerId)
  const localCs = useCombatStatus()
  const combatStatus = globalCs ?? localCs
  const { currAp } = combatStatus
  const globalContender = useContenders(playerId)
  const contender = globalContender ?? character

  const maxAp = contender.secAttr.curr.actionPoints

  const actorId = action?.actorId ?? ""
  const targetId = action?.targetId ?? ""
  const isActor = actorId === playerId
  const isTarget = targetId === playerId
  let apCost = 0
  if (isActor) apCost = action?.apCost ?? 0
  if (isTarget && action?.reactionRoll) {
    apCost = action.reactionRoll?.opponentApCost ?? 0
  }

  const handleSetAp = async (i: number) => {
    const newValue = i < currAp ? i : i + 1
    await useCases.character.updateCombatStatus({
      charId: playerId,
      payload: { currAp: newValue }
    })
  }

  const apArr = []
  for (let i = 0; i < maxAp; i += 1) {
    const isChecked = i < currAp
    const isPreview = i >= currAp - apCost && i < currAp
    apArr.push({ id: i.toString(), isChecked, isPreview })
  }

  return <ApVisualizerUi apArr={apArr} maxAp={maxAp} currAp={currAp} handleSetAp={handleSetAp} />
}

function NoCombatApVisualizer() {
  const useCases = useGetUseCases()
  const character = useCharacter()
  const combatStatus = useCombatStatus()
  const { currAp } = combatStatus

  const maxAp = character.secAttr.curr.actionPoints

  const handleSetAp = async (i: number) => {
    const newValue = i < currAp ? i : i + 1
    await useCases.character.updateCombatStatus({
      charId: character.charId,
      payload: { currAp: newValue }
    })
  }

  const apArr = []
  for (let i = 0; i < maxAp; i += 1) {
    const isChecked = i < currAp
    const isPreview = false
    apArr.push({ id: i.toString(), isChecked, isPreview })
  }

  return <ApVisualizerUi maxAp={maxAp} currAp={currAp} handleSetAp={handleSetAp} apArr={apArr} />
}

export default function ApVisualizer({ contenderId }: { contenderId?: string }) {
  if (contenderId) return <CombatApVisualizer contenderId={contenderId} />
  return <NoCombatApVisualizer />
}
