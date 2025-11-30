import { StyleSheet } from "react-native"

import { useAbilities } from "lib/character/abilities/abilities-provider"
import { useCombatStatus } from "lib/character/combat-status/combat-status-provider"
import { useCombatState } from "lib/combat/use-cases/sub-combats"

import CheckBox from "components/CheckBox/CheckBox"
import List from "components/List"
import Section from "components/Section"
import Spacer from "components/Spacer"
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

export default function ApVisualizer({ charId }: { charId: string }) {
  const useCases = useGetUseCases()
  const { data: combatStatus } = useCombatStatus(charId, cs => ({
    currAp: cs.currAp,
    combatId: cs.combatId
  }))
  const { data: action } = useCombatState(combatStatus.combatId, state => state.action)
  const { data: maxAp } = useAbilities(charId, a => a.secAttr.curr.actionPoints)

  const actorId = action?.actorId ?? ""
  const targetId = action?.targetId ?? ""
  const isActor = actorId === charId
  const isTarget = targetId === charId
  let apCost = 0
  if (isActor) apCost = action?.apCost ?? 0
  if (isTarget && action?.reactionRoll) {
    apCost = action.reactionRoll?.opponentApCost ?? 0
  }

  const handleSetAp = async (i: number) => {
    const newValue = i < combatStatus.currAp ? i : i + 1
    await useCases.character.updateCombatStatus({
      charId,
      payload: { currAp: newValue }
    })
  }

  const apArr = []
  for (let i = 0; i < maxAp; i += 1) {
    const isChecked = i < combatStatus.currAp
    const isPreview = i >= combatStatus.currAp - apCost && i < combatStatus.currAp
    apArr.push({ id: i.toString(), isChecked, isPreview })
  }

  return (
    <ApVisualizerUi
      apArr={apArr}
      maxAp={maxAp}
      currAp={combatStatus.currAp}
      handleSetAp={handleSetAp}
    />
  )
}
